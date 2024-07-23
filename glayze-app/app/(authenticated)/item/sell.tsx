import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { Text, SafeAreaView, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { SwipeButton } from "@/components/ui/SwipeButton";
import { useRouter } from "expo-router";

export default function Sell() {
  const [amount, setAmount] = useState("0");
  const router = useRouter();

  const updateAmount = (value) => {
    if (amount === "0" && value !== ".") {
      setAmount(value);
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const clearAmount = () => setAmount("0");

  const handleSwipe = () => {
    console.log("Swipe complete");
    router.push("/aux/success");
  };

  const percentages = ["10%", "25%", "50%", "MAX"];
  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "X"];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4">
        <BackArrow />
        <Text className="text-white text-2xl font-semibold text-center">
          Sell
        </Text>
        <View className="mt-4 bg-neutral-800 rounded-xl p-4">
          <Text className="text-white text-3xl font-bold text-center">
            ${amount}
          </Text>
        </View>

        <View className="flex-row justify-between mt-6 px-4">
          {percentages.map((percent, i) => (
            <Button
              key={i}
              buttonStyle="bg-neutral px-5 py-3 rounded-full"
              onPress={() => updateAmount(percent)}
            >
              <Text className="text-white font-semibold">{percent}</Text>
            </Button>
          ))}
        </View>

        <View className="flex-row flex-wrap justify-between mt-6">
          {numpad.map((num, i) =>
            num !== "X" ? (
              <TouchableOpacity
                key={i}
                className="w-[30%] aspect-square rounded-full items-center justify-center mb-4"
                onPress={() => updateAmount(num)}
              >
                <Text className="text-white text-4xl font-semibold">{num}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={i}
                onPress={clearAmount}
                className="w-[30%] aspect-square items-center justify-center mb-4"
              >
                <Image
                  source={require("@/assets/images/backspace.png")}
                  className="w-12 h-6"
                />
              </TouchableOpacity>
            )
          )}
        </View>

        <View className="mt-auto mb-12">
          <SwipeButton
            text="Swipe to Buy"
            primaryColor="bg-primary"
            onComplete={handleSwipe}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
