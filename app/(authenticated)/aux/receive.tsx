import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { useTheme } from "@/contexts/theme-context";
import { share } from "@/actions/share";

export default function Receive() {
  const address = "0x1234567890"; // TODO: Fetch from API
  const { theme } = useTheme();

  const handlePress = () => {
    // TODO: Implement referral functionality
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
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
          onPress={() => share(address)}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
        >
          <Text
            className="text-center py-4 font-bold"
            style={{ color: theme.secondaryTextColor }}
          >
            Share
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
