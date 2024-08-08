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
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { DEPLOYMENT_FEE } from "@/utils/constants";
import { Header } from "@/components/header";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";
import { colors } from "@/utils/theme";
import { useEmbeddedTweet, usePost } from "@/hooks";
import { fetchTweet } from "@/hooks/use-embedded-tweet";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
// import { useProduct } from "@/hooks";
import Purchases from "react-native-purchases";

interface FormInput {
  name: string;
  symbol: string;
  url: string;
}

export default function Glayze() {
  const { theme, themeName } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // const {
  //   data: product,
  //   isLoading,
  //   isError,
  // } = useProduct(CREATE_POST_PRODUCT_ID);
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

  const handlePurchase = async (input: FormInput) => {
    try {
      const offerings = await Purchases.getOfferings();
      console.log(offerings);
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        // Display packages for sale
      }
      const { name, symbol, url } = input;
      if (!name || !symbol || !url) {
        throw new Error("Name, symbol, or url is not provided.");
      }

      const tokenId = url.split("/").pop();
      if (!tokenId) {
        throw new Error("Token ID not found in the URL.");
      }

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
            tokenId,
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

      const data = await response.json();
      console.log("Metadata IPFS Hash:", data.metadataIpfsHash);
    } catch (error) {
      console.error("Purchase failed:", error);
      Toast.show({
        text1: "Error",
        text2: error instanceof Error ? error.message : "Purchase failed",
        type: "error",
      });
    }
  };
  //   try {
  //     const { customerInfo } = await Purchases.purchaseStoreProduct(product);
  //     if (
  //       typeof customerInfo.entitlements.active["my_entitlement_identifier"] !==
  //       "undefined"
  //     ) {
  //       console.log("Success", "Purchase successful!");
  //       // Here you can proceed with creating the post using smart contract
  //       // createPost();
  //     } else {
  //       console.log(
  //         "Error",
  //         "Purchase completed, but entitlement not found. Please contact support."
  //       );
  //     }
  //   } catch (e: any) {
  //     if (!e.userCancelled) {
  //       console.error("Purchase error:", e);
  //       console.log("Error", "An error occurred during purchase.");
  //     }
  //   }
  // }, [product]);
  // if (!smartAccount) console.log("No smart account");
  // const encodedCall = encodeFunctionData({
  //   abi,
  //   functionName: "createPost",
  //   args: [name, symbol, url],
  // });
  // const tx = {
  //   to: CONTRACT_ADDRESS,
  //   data: encodedCall,
  // };
  // const amountInWei = await smartAccount?.getGasEstimate([tx, tx], {
  //   paymasterServiceData: {
  //     mode: PaymasterMode.SPONSORED,
  //   },
  // });
  // console.log(amountInWei?.toString());

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
                Pay $1.09
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
