import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/input";
import { BackArrow } from "@/components/ui/back-arrow";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  const address = "0x1234567890"; // TODO: Fetch from API

  const handlePress = () => {
    // TODO: Implement referral functionality
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />
      <View className="flex items-center">
        <Text className="text-white font-semibold text-2xl">Deposit USDC</Text>
      </View>
      <View className="flex-col space-y-4 p-6">
        <Text className="text-white font-medium pb-2">Your EVM Address</Text>
        <Input placeholder={address} readOnly />
        <Text className="text-white font-semibold pb-2">
          WARNING! Only send on USDC on Base
        </Text>
        <Button
          buttonStyle="bg-primary w-full rounded-lg"
          onPress={handlePress}
        >
          <Text className="text-black text-center py-4">Share</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
