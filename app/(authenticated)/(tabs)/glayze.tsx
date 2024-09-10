import { Input } from "@/components/ui/input";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter, Href } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import {
  ABI,
  DEPLOYMENT_FEE,
  ERC20_ABI,
  GLAYZE_TEXT_DISCLAIMER,
} from "@/utils/constants";
import { Header } from "@/components/header";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { colors } from "@/utils/theme";
import { useRealCreator, useBalance } from "@/hooks";
import { fetchTweet } from "@/hooks/use-embedded-tweet";
import {
  Address,
  encodeFunctionData,
  parseUnits,
  decodeFunctionData,
} from "viem";
import { fetchPublicClient, usePublicClient } from "@/hooks/use-public-client";
import { useConstants } from "@/hooks/use-constants";
import {
  decodeAndLogFunctionData,
  formatToMaxLength,
  formatUSDC,
  getPostIdFromUrl,
} from "@/utils/helpers";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { Loading } from "@/components/loading";
import { fetchRealCreator } from "@/hooks/use-real-creator";
import { AppState, AppStateStatus } from "react-native";
import { GlayzeToast } from "@/components/ui/glayze-toast";
import { insertPost } from "@/utils/api-calls";

interface FormInput {
  name: string;
  symbol: string;
  url: string;
}

export default function Glayze() {
  const { theme, themeName } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
  const {
    smartAccountClient,
    isLoading: smartAccountLoading,
    error: smartAccountError,
  } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useBalance(address);
  const { data: constants, isLoading: constantsLoading } = useConstants();
  const publicClient = fetchPublicClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      name: "",
      symbol: "",
      url: "",
    },
  });

  const [isJSReady, setIsJSReady] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Set a timeout to ensure JS is ready
    const timer = setTimeout(() => {
      setIsJSReady(true);
    }, 1000); // Adjust this delay if needed

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      setIsJSReady(true);
    }
  };

  useEffect(() => {
    setHasSufficientBalance(
      Number(balance) >= Number(constants?.usdcCreationPayment)
    );
  }, [balance, constants, balanceLoading, constantsLoading]);

  const uploadToIpfs = async (
    name: string,
    symbol: string,
    postId: string,
    url: string
  ) => {
    let image: string;
    let realCreator: Address | null = null;
    try {
      const tweetData = await fetchTweet(url);
      if (
        !tweetData ||
        !tweetData.user ||
        !tweetData.user.profile_image_url_https
      )
        throw new Error("Failed to fetch tweet data or profile image.");

      if (tweetData.mediaDetails?.length && tweetData.mediaDetails.length > 0) {
        console.log("Media details found:", tweetData.mediaDetails);
        image = tweetData.mediaDetails[0].media_url_https;
      } else {
        console.log("No media details found.");
        image = tweetData.user.profile_image_url_https;
      }
      console.log("id: ", tweetData.user.id_str);
      realCreator = await fetchRealCreator(tweetData.user.id_str);
      console.log("Real creator:", realCreator);
    } catch (fetchError) {
      console.error("Error fetching tweet:", fetchError);
      throw new Error(
        "Failed to fetch tweet data. Please check your network connection and try again."
      );
    }

    try {
      console.log("Starting IPFS upload...");
      if (!image || image === "") throw new Error("Image is empty.");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/ipfs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            postId,
            name,
            symbol,
            image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload metadata to IPFS.");
      }

      const { metadataIpfsHash, imageIpfsHash } = await response.json();
      console.log("Metadata IPFS Hash:", metadataIpfsHash);
      return {
        metadataIpfsHash,
        postId,
        name,
        symbol,
        imageIpfsHash,
        realCreator,
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const handlePurchase = async (input: FormInput) => {
    let txSuccess = false;
    try {
      setIsLoading(true);
      if (!publicClient) throw new Error("No public client found.");
      if (!smartAccountClient || smartAccountError)
        throw new Error("No smart account found.");

      const { name, url } = input;
      const symbol = input.symbol.split("$").pop(); // Remove the $ prefix
      if (!name || !symbol || !url) {
        throw new Error("Name, symbol, or url is not provided.");
      }
      const postId = getPostIdFromUrl(url);
      if (!postId) {
        throw new Error("Post ID not found in the URL.");
      }

      const response = await uploadToIpfs(name, symbol, postId, url);
      if (!response) throw new Error("Failed to upload to IPFS.");
      const { metadataIpfsHash, imageIpfsHash, realCreator } = response;
      console.log("real creator in post: ", realCreator);
      const transactions = [
        {
          to: process.env.EXPO_PUBLIC_USDC_ADDRESS! as Address,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [
              process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
              parseUnits("1", 6),
            ],
          }),
          value: 0n,
        },
        {
          to: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
          data: encodeFunctionData({
            abi: ABI,
            functionName: "createPost",
            args: [BigInt(postId), name, symbol, metadataIpfsHash],
          }),
          value: 0n,
        },
      ];
      const txHash = await smartAccountClient.sendTransactions({
        transactions,
      });
      console.log("✅ Transaction successfully sponsored!");
      console.log(
        `🔍 View on Blockscout: https://base-sepolia.blockscout.com/tx/${txHash}`
      );

      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as Address,
      });
      if (!txReceipt) throw new Error("Failed to get transaction receipt.");

      const error = await insertPost(
        postId,
        name,
        symbol,
        metadataIpfsHash,
        url,
        realCreator,
        imageIpfsHash,
        realCreator
      );
      txSuccess = true;
      if (error) throw error;
      if (realCreator) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/set-creator`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              postId,
              realCreator,
            }),
          }
        );
        if (response.status !== 200) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            `Failed to set real creator: ${
              errorData ? JSON.stringify(errorData) : response.statusText
            }`
          );
        }
      }
      setIsLoading(false);
      router.replace(
        `/(authenticated)/aux/success?isGlayze=true&id=${postId}&symbol=${symbol}` as Href<string>
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Purchase failed:", error);
      decodeAndLogFunctionData(error.message as string);
      router.replace(
        `/(authenticated)/aux/error?success=${txSuccess}` as Href<string>
      );
    }
  };

  if (smartAccountLoading || balanceLoading || constantsLoading || !isJSReady)
    return <Loading />;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6 py-2"
          >
            <Header title="Ready to Glayze?" />
            <View className="space-y-4 mt-2">
              <View className="flex flex-row -mx-2">
                <View className="w-1/2 px-2">
                  <Controller
                    control={control}
                    rules={{
                      required: "Name is required.",
                      validate: (value) => {
                        if (value.length > 12)
                          return "Name must be 12 characters or less.";
                        if (value.startsWith("$"))
                          return "Name cannot start with '$' symbol.";
                        return true;
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Text
                          className="text-lg"
                          style={{ color: theme.textColor }}
                        >
                          Name
                        </Text>
                        <Input
                          placeholder="Name"
                          value={value}
                          onChangeText={(text) => {
                            const formattedText = formatToMaxLength(text, 12);
                            onChange(formattedText);
                          }}
                          style={{
                            color: theme.textColor,
                            backgroundColor: theme.secondaryBackgroundColor,
                          }}
                        />
                        {errors.name && (
                          <Text
                            style={{
                              color: "red",
                              fontSize: 12,
                              marginTop: 6,
                              marginLeft: 2,
                            }}
                          >
                            {errors.name.message}
                          </Text>
                        )}
                      </>
                    )}
                    name="name"
                  />
                </View>
                <View className="w-1/2 px-2">
                  <Controller
                    control={control}
                    rules={{
                      required: "Ticker Symbol is required.",
                      validate: (value) => {
                        if (!value.startsWith("$"))
                          return "Symbol must start with $";
                        if (value.length > 13)
                          return "Symbol must be 13 characters or less (including $).";
                        return true;
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Text
                          className="text-lg"
                          style={{ color: theme.textColor }}
                        >
                          Ticker Symbol
                        </Text>
                        <Input
                          placeholder="$TICKER"
                          value={value}
                          onChangeText={(text) => {
                            const formattedText = formatToMaxLength(text, 13);
                            onChange(formattedText);
                          }}
                          style={{
                            color: theme.textColor,
                            backgroundColor: theme.secondaryBackgroundColor,
                          }}
                        />
                        {errors.symbol && (
                          <Text
                            style={{
                              color: "red",
                              fontSize: 12,
                              marginTop: 6,
                              marginLeft: 2,
                            }}
                          >
                            {errors.symbol.message}
                          </Text>
                        )}
                      </>
                    )}
                    name="symbol"
                  />
                </View>
              </View>
              <View className="mt-1">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value:
                        /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/status(es)?\/\d+(\?.*)?$/,
                      message: "Must be a valid Twitter post URL",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <View className="flex-row justify-between items-center">
                        <Text
                          className="text-lg"
                          style={{ color: theme.textColor }}
                        >
                          URL
                        </Text>
                        <TouchableOpacity onPress={() => onChange("")}>
                          <Text style={{ color: theme.tintColor }}>Clear</Text>
                        </TouchableOpacity>
                      </View>
                      <Input
                        placeholder="https://x.com/username/status/123213"
                        value={value}
                        onChangeText={onChange}
                        style={{
                          color: theme.textColor,
                          backgroundColor: theme.secondaryBackgroundColor,
                        }}
                      />
                      {errors.url && (
                        <Text
                          style={{
                            color: "red",
                            fontSize: 12,
                            marginTop: 6,
                            marginLeft: 2,
                          }}
                        >
                          {errors.url.message || "URL is required."}
                        </Text>
                      )}
                    </>
                  )}
                  name="url"
                />
              </View>
            </View>
            {/* <PaymentDetails /> */}
            <Button
              buttonStyle="w-full rounded-full mt-12"
              onPress={handleSubmit(handlePurchase)}
              disabled={!hasSufficientBalance}
              style={{
                backgroundColor: !hasSufficientBalance
                  ? theme.mutedForegroundColor
                  : theme.tabBarActiveTintColor,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!isLoading ? (
                  <Text
                    className="text-center py-4 font-semibold text-lg"
                    style={{ color: colors.white }}
                  >
                    {!hasSufficientBalance && "Insufficient Balance: "}
                    Pay $
                    {formatUSDC(constants?.usdcCreationPayment).slice(0, 4)}
                  </Text>
                ) : (
                  <ActivityIndicator
                    size="small"
                    color={colors.white}
                    style={{ marginLeft: 10, paddingVertical: 14 }}
                  />
                )}
              </View>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View className="absolute bottom-24 px-6 py-3">
        <Text style={{ color: theme.mutedForegroundColor }}>
          {GLAYZE_TEXT_DISCLAIMER}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const PaymentDetails = () => {
  const { theme } = useTheme();
  return (
    <View className="mt-4 space-y-4">
      <Text className="text-xl" style={{ color: theme.textColor }}>
        Payment Details
      </Text>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Deployment</Text>
        <Text style={{ color: theme.textColor }}>${DEPLOYMENT_FEE}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Fee</Text>
        <Text style={{ color: theme.textColor }}>$0.09</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Total</Text>
        <Text style={{ color: theme.textColor }}>$1.09</Text>
      </View>
    </View>
  );
};
