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
import { DEPLOYMENT_FEE } from "@/utils/constants";
import { Header } from "@/components/header";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { colors } from "@/utils/theme";
import { useSmartAccountClient, useRealCreator } from "@/hooks";
import { fetchTweet } from "@/hooks/use-embedded-tweet";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
// import { useProduct } from "@/hooks";
import Purchases from "react-native-purchases";
import abi from "@/abi.json";
import { Address } from "viem";
import { supabase } from "@/utils/supabase";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { client } from "@/utils/dynamic-client.native";

interface FormInput {
  name: string;
  symbol: string;
  url: string;
}

export default function Glayze() {
  const { theme, themeName } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const { data: smartAccountClient, isError } = useSmartAccountClient();
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useReactiveClient(client);
  const [xUserId, setXUserId] = useState<number | null>(null);
  const { data: realCreator } = useRealCreator(xUserId);

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

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (e) {
      Toast.show({
        text1: "Cancelled",
        text2: "Did not select image",
        type: "info",
      });
    }
  };

  const uploadToIpfs = async (
    name: string,
    symbol: string,
    postId: string,
    url: string
  ) => {
    try {
      let image: string;
      if (selectedImage !== null) {
        const imageFile = await FileSystem.readAsStringAsync(selectedImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
        image = `data:image/jpeg;base64,${imageFile}`;
      } else {
        try {
          const tweetData = await fetchTweet(url);
          if (
            !tweetData ||
            !tweetData.user ||
            !tweetData.user.profile_image_url_https
          ) {
            throw new Error("Failed to fetch tweet data or profile image.");
          }
          image = tweetData.user.profile_image_url_https;
          console.log(tweetData.user.id_str);
          setXUserId(parseInt(tweetData.user.id_str));
        } catch (fetchError) {
          console.error("Error fetching tweet:", fetchError);
          throw new Error(
            "Failed to fetch tweet data. Please check your network connection and try again."
          );
        }
      }

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
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to upload metadata to IPFS: ${
            errorData ? JSON.stringify(errorData) : response.statusText
          }`
        );
      }

      const { metadataIpfsHash, imageIpfsHash } = await response.json();
      console.log("Metadata IPFS Hash:", metadataIpfsHash);
      return { metadataIpfsHash, postId, name, symbol, imageIpfsHash };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const handlePurchase = async (input: FormInput) => {
    try {
      setIsLoading(true);
      if (!smartAccountClient || isError)
        throw new Error("No smart account found.");

      const { name, symbol, url } = input;
      if (!name || !symbol || !url) {
        throw new Error("Name, symbol, or url is not provided.");
      }
      const postId = url.split("/").pop();
      if (!postId) {
        throw new Error("Token ID not found in the URL.");
      }

      const response = await uploadToIpfs(name, symbol, postId, url);
      if (!response) throw new Error("Failed to upload to IPFS.");
      const { metadataIpfsHash, imageIpfsHash } = response;
      // const offerings = await Purchases.getOfferings();
      // console.log(offerings);
      // if (
      //   offerings.current !== null &&
      //   offerings.current.availablePackages.length !== 0
      // ) {
      //   // Display packages for sale
      // }
      const txHash = await smartAccountClient.writeContract({
        address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
        abi,
        functionName: "createPost",
        args: [postId, name, symbol, metadataIpfsHash],
      });
      console.log("✅ Transaction successfully sponsored!");
      console.log(
        `🔍 View on Etherscan: https://sepolia.basescan.org/tx/${txHash}`
      );
      if (realCreator) {
        const txHash = await smartAccountClient.writeContract({
          address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
          abi,
          functionName: "setRealCreator",
          args: [postId, realCreator],
        });
        console.log("✅ Transaction successfully sponsored!");
        console.log(
          `🔍 View on Etherscan: https://sepolia.basescan.org/tx/${txHash}`
        );
      }
      const { error } = await supabase.from("Posts").insert([
        {
          post_id: parseInt(postId),
          name,
          symbol,
          url,
          contract_creator: wallets.primary?.address,
          real_creator: realCreator,
          image_uri: imageIpfsHash,
          volume: 0,
          ath: 0,
        },
      ]);
      if (error) {
        throw new Error("Failed to create post in Supabase.");
      }
      setIsLoading(false);
      // router.replace(
      //   `/(authenticated)/aux/success?isGlayze=true&id=${data.postId}` as Href
      // );
    } catch (error) {
      setIsLoading(false);
      console.error("Purchase failed:", error);
      router.replace("/(authenticated)/aux/error" as Href);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <Toast />
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
                      required: true,
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
                          onChangeText={onChange}
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
                            {errors.name.message || "Name is required."}
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
                      required: true,
                      validate: (value) =>
                        value.startsWith("$") || "Symbol must start with $",
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
                          onChangeText={onChange}
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
                            {errors.symbol.message ||
                              "Ticker Symbol is required."}
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
                      <Text
                        className="text-lg"
                        style={{ color: theme.textColor }}
                      >
                        URL
                      </Text>
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
              <View>
                <Text className="text-lg" style={{ color: theme.textColor }}>
                  Image
                </Text>
                {!selectedImage ? (
                  <>
                    <Text
                      className="text-sm mb-4"
                      style={{ color: theme.mutedForegroundColor }}
                    >
                      The creator's profile picture will be used if no image is
                      provided
                    </Text>
                    <Button
                      buttonStyle="rounded-lg py-3 border flex-row items-center justify-center w-full"
                      style={{
                        backgroundColor: theme.backgroundColor,
                        borderColor: theme.tabBarActiveTintColor,
                      }}
                      onPress={selectImage}
                    >
                      <Image
                        source={
                          themeName === "dark"
                            ? require("@/assets/images/dark/upload.png")
                            : require("@/assets/images/light/upload.png")
                        }
                        className="w-6 h-6 mr-2"
                      />
                      <Text
                        className="text-center"
                        style={{ color: theme.textColor }}
                      >
                        Choose Image
                      </Text>
                    </Button>
                  </>
                ) : (
                  <View className="flex items-center p-3">
                    <View
                      className="border-2 rounded-full overflow-hidden mt-2"
                      style={{
                        borderColor: theme.textColor,
                        width: 100, // Adjust this value as needed
                        height: 100, // Adjust this value as needed
                      }}
                    >
                      <Image
                        source={{ uri: selectedImage }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        contentFit="cover"
                        onError={(e) => console.log(e)}
                      />
                    </View>
                    <TouchableOpacity onPress={() => setSelectedImage(null)}>
                      <Text
                        style={{ color: theme.tabBarActiveTintColor }}
                        className="text-lg pt-1"
                      >
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <PaymentDetails />
            <Button
              buttonStyle="w-full rounded-lg my-4"
              style={{
                backgroundColor: theme.tabBarActiveTintColor,
              }}
              onPress={handleSubmit(handlePurchase)}
            >
              <Text
                className="text-center font-semibold py-4"
                style={{ color: colors.white }}
              >
                {isLoading ? <ActivityIndicator size="large" /> : "Pay $1.09"}
              </Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
