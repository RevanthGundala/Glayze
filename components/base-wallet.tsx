import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Text, Pressable } from "react-native";
import * as Linking from "expo-linking";
import { CoinbaseWalletSDK } from "@mobile-wallet-protocol/client";
import { useRouter, Href } from "expo-router";

// const sdk = new CoinbaseWalletSDK({
//   appDeeplinkUrl: "https://glayze.app", // required
//   appName: "Glayze",
//   appChainIds: [8453], // Sepolia
//   appLogoUrl: "",
// });

const PREFIX_URL = Linking.createURL("https://glayze.app");

// 3. Initialize SDK
const sdk = new CoinbaseWalletSDK({
  appDeeplinkUrl: PREFIX_URL,
  appName: "Glayze",
  appChainIds: [8453],
  appLogoUrl: require("@/assets/images/icon.png"),
});

const provider = sdk.makeWeb3Provider();

export const BaseWallet = () => {
  const handleLogin = async () => {
    try {
      if (Platform.OS === "web") {
        console.log("Logging in with base smart wallet on web");
      } else {
        console.log("Logging in with base smart wallet on mobile");

        const addresses = await provider.request({
          method: "eth_requestAccounts",
        });
        const signedData = await provider.request({
          method: "personal_sign",
          params: ["0x48656c6c6f20776f726c6421", addresses[0]],
        });
        console.log("addresses", addresses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      className="pt-2 items-center justify-center"
      onPress={handleLogin}
    >
      <View
        className={`flex items-center justify-center bg-black overflow-hidden w-full rounded-full py-3`}
      >
        <View className="flex-row items-center justify-center bg-black">
          <CoinbaseWalletLogo containerClassName="pr-2.5" />
          <Text className="text-white font-semibold">Connect Wallet</Text>
        </View>
      </View>
    </Pressable>
  );
};

function CoinbaseWalletLogo({ size = 26, containerClassName = "pt-2" }) {
  return (
    <View className={containerClassName}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Path
          d="M2.66675 15.9998C2.66675 23.3628 8.63712 29.3332 16.0001 29.3332C23.363 29.3332 29.3334 23.3628 29.3334 15.9998C29.3334 8.63687 23.363 2.6665 16.0001 2.6665C8.63712 2.6665 2.66675 8.63687 2.66675 15.9998ZM12.5927 11.7035H19.4075C19.9001 11.7035 20.2964 12.0998 20.2964 12.5924V19.4072C20.2964 19.8998 19.9001 20.2961 19.4075 20.2961H12.5927C12.1001 20.2961 11.7038 19.8998 11.7038 19.4072V12.5924C11.7038 12.0998 12.1001 11.7035 12.5927 11.7035Z"
          fill="white"
        />
      </Svg>
    </View>
  );
}
