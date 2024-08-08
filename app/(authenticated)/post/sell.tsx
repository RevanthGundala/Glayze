import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { ShareHeader } from "@/components/share-header";
import { useLocalSearchParams } from "expo-router";

export default function Sell() {
  const maxFontSize = 48;
  const minFontSize = 12;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { name, symbol, image } = useLocalSearchParams();
  const [amount, setAmount] = useState("0");
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [auraAmount, setAuraAmount] = useState(0);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const updateAmount = (value: string) => {
    if (amount === "0" && value !== ".") {
      setAmount(value);
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const length = amount.length;
    let newSize = maxFontSize - length * 1.5; // Adjust the scaling factor as needed
    newSize = Math.max(newSize, minFontSize);
    setFontSize(newSize);
  }, [amount, maxFontSize, minFontSize]);

  const clearAmount = () => setAmount("0");

  const handleSell = () => {
    // TODO:
    try {
      setModalVisible(false);
      setTimeout(() => {
        router.replace(
          "/(authenticated)/aux/success?isBuy=false&shares=100&price=0.99&symbol=GLAZE" as Href
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
      <View className="flex-row items-center justify-between px-4 w-full">
        <Header backArrow />
        <ShareHeader
          name={name as string}
          symbol={symbol as string}
          image={image as string}
        />
        <View className="w-1/5" />
      </View>
      <View className="flex-1 px-4 pt-2">
        <Text
          className="text-3xl font-semibold text-center"
          style={{ color: theme.textColor }}
        >
          Sell
        </Text>
        <Text
          className="text-center text-sm pt-2"
          style={{ color: theme.mutedForegroundColor }}
        >
          0 Shares (~$0)
        </Text>
        <View className="mt-2 rounded-xl p-4">
          <Text
            className="font-bold text-center"
            style={{ color: theme.textColor, fontSize }}
          >
            {amount}
          </Text>
        </View>

        <View className="flex-row justify-between mt-2 px-4">
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
            onPress={openModal}
            style={{ backgroundColor: theme.tabBarActiveTintColor }}
          >
            <Text
              className="text-center py-4 font-semibold text-lg"
              style={{ color: colors.white }}
            >
              Sell for $0.99
            </Text>
          </Button>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                isKeyboardVisible ? Keyboard.dismiss() : closeModal()
              }
              className="flex-1 justify-end bg-black/50"
            >
              <View
                style={{ backgroundColor: theme.backgroundColor }}
                className="rounded-t-3xl p-6 h-[325px]"
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
                      keyboardType="numeric"
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
                    <Text
                      className="text-sm"
                      style={{ color: theme.textColor }}
                    >
                      MAX
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-auto mb-10 flex-row justify-between">
                  <Button
                    onPress={handleSell}
                    buttonStyle="py-3 flex-1 rounded-full"
                    style={{ backgroundColor: theme.tintColor }}
                  >
                    <Text
                      style={{ color: colors.white }}
                      className="font-semibold text-center text-lg"
                    >
                      Sell for $0.99
                    </Text>
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
