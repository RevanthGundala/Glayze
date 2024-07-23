import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Button } from "@/components/ui/Button";

type SuccessProps = {
  type: "buy" | "sell";
  amount: number;
  asset: any;
};

export default function Success({ type, amount, asset }: SuccessProps) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
      <View className="items-center">
        <Image
          source={require("@/assets/images/aux/success.png")}
          style={{ width: 100, height: 100 }}
          className="mb-6"
        />
        <Text className="text-green-500 text-3xl font-bold mb-2">Success!</Text>
        <Text className="text-white text-xl text-center mb-8">
          Your transaction has been completed.
        </Text>
      </View>

      <View className="bg-neutral-800 rounded-xl p-6 w-full mb-8">
        <Text className="text-white text-lg mb-4">Transaction Details:</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Type:</Text>
          <Text className="text-white">{type}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Amount:</Text>
          <Text className="text-white">${amount}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-400">Asset:</Text>
          <Text className="text-white">{asset}</Text>
        </View>
      </View>

      <Button
        buttonStyle="bg-primary py-4 px-8 rounded-full"
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text className="text-black text-lg font-medium">Back to Home</Text>
      </Button>
    </SafeAreaView>
  );
}
