import { BackArrow } from "@/components/ui/back-arrow";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";

export default function Buy() {
  const [amount, setAmount] = useState("0");
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [auraAmount, setAuraAmount] = useState(0);
  const updateAmount = (value: string) => {
    if (amount === "0" && value !== ".") {
      setAmount(value);
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const clearAmount = () => setAmount("0");

  const handleBuy = () => {
    // TODO:
    try {
      setModalVisible(false);
      setTimeout(() => {
        router.replace(
          "/(authenticated)/aux/success?isBuy=true&shares=100&price=0.99&symbol=GLAZE" as Href
        );
      }, 300); // Add a small delay to ensure the modal is fully dismissed
    } catch (error) {
      console.log(error);
      router.replace("/(authenticated)/aux/error" as Href);
    }
  };

  const percentages = ["10%", "25%", "50%", "MAX"];
  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "X"];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex-1 px-4">
        <View className="flex flex-row">
          <Header backArrow />
        </View>
        <Text
          className="text-2xl font-semibold text-center"
          style={{ color: theme.textColor }}
        >
          Buy
        </Text>
        <Text
          className="text-center text-sm pt-2"
          style={{ color: theme.mutedForegroundColor }}
        >
          0 Shares (~$0)
        </Text>
        <View className="mt-2 rounded-xl p-4">
          <Text
            className="text-5xl font-bold text-center"
            style={{ color: theme.textColor }}
          >
            {amount}
          </Text>
        </View>

        <View className="flex-row justify-between mt-6 px-4">
          {percentages.map((percent, i) => (
            <Button
              key={i}
              style={{ backgroundColor: theme.tabBarActiveTintColor }}
              buttonStyle="bg-neutral px-5 py-3 rounded-full"
              onPress={() => updateAmount(percent)}
            >
              <Text className="font-semibold" style={{ color: colors.white }}>
                {percent}
              </Text>
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
                <Text
                  className="text-4xl font-semibold"
                  style={{ color: theme.textColor }}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={i}
                onPress={clearAmount}
                className="w-[30%] aspect-square items-center justify-center mb-4"
              >
                <Image
                  source={
                    themeName === "dark"
                      ? require("@/assets/images/dark/backspace.png")
                      : require("@/assets/images/light/backspace.png")
                  }
                  className="w-12 h-6"
                />
              </TouchableOpacity>
            )
          )}
        </View>
        <View className="mt-auto mb-10">
          <Button
            buttonStyle="w-full rounded-full"
            onPress={() => setModalVisible(true)}
            style={{ backgroundColor: theme.tabBarActiveTintColor }}
          >
            <Text
              className="text-center py-4 font-semibold text-lg"
              style={{ color: theme.secondaryTextColor }}
            >
              Buy for $0.99
            </Text>
          </Button>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="flex-1 justify-end bg-black/50"
          >
            <View
              style={{ backgroundColor: theme.backgroundColor }}
              className="rounded-t-3xl p-6 h-[300px]"
            >
              <Text
                style={{ color: theme.textColor }}
                className="text-xl font-medium text-center"
              >
                Confirm your order
              </Text>
              <Text
                style={{ color: theme.mutedForegroundColor }}
                className="py-2 text-center"
              >
                Use $AURA to pay for transaction fees
              </Text>
              <Text className="pt-4 pb-1" style={{ color: theme.textColor }}>
                Balance: 5 $AURA
              </Text>
              <View className="flex-row items-center justify-between mb-4">
                <View className="w-2/3">
                  <Input
                    style={{
                      color: theme.textColor,
                      backgroundColor: theme.secondaryBackgroundColor,
                    }}
                    placeholder={"0"}
                    value={auraAmount.toString()}
                    onChangeText={(text) => setAuraAmount(Number(text))}
                  />
                </View>
                <TouchableOpacity
                  className="aboslute right-32"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.mutedForegroundColor,
                  }}
                  onPress={() => setAuraAmount(0)}
                >
                  <Text className="text-sm" style={{ color: theme.textColor }}>
                    MAX
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mt-auto mb-4 flex-row justify-between">
                <Button
                  onPress={handleBuy}
                  buttonStyle="py-3 flex-1 rounded-lg"
                  style={{ backgroundColor: theme.tintColor }}
                >
                  <Text
                    style={{ color: colors.white }}
                    className="font-semibold text-center text-lg"
                  >
                    Buy for $0.99
                  </Text>
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
