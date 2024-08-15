import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { useSmartAccount } from "@/contexts/smart-account-context";

export default function Receive() {
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { theme } = useTheme();

  const copyToClipboard = async () => {
    console.log("Copying to clipboard");
    try {
      await Clipboard.setStringAsync(address);
      Toast.show({
        text1: "Copied to clipboard",
        text2: "Address copied to clipboard",
        type: "success",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error copying to clipboard",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <Toast />
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="flex items-center">
        <Text
          className="font-semibold text-2xl"
          style={{ color: theme.textColor }}
        >
          Receive USDC
        </Text>
      </View>
      <View className="flex-col space-y-4 p-6">
        <Text className="font-medium pb-2" style={{ color: theme.textColor }}>
          Your EVM Address
        </Text>
        <Input placeholder={address} readOnly />
        <Text className="font-semibold pb-2" style={{ color: theme.textColor }}>
          WARNING! Only send on USDC on Base
        </Text>
        <Button
          buttonStyle="w-full rounded-lg"
          onPress={copyToClipboard}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
        >
          <Text
            className="text-center py-4 font-bold"
            style={{ color: colors.white }}
          >
            Copy
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
