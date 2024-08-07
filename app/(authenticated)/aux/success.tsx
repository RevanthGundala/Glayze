import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { colors } from "@/utils/theme";
import { useTheme } from "@/contexts/theme-context";

export default function Success() {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { shares, price, symbol, isBuy, isGlayze, id } = useLocalSearchParams();

  return (
    <SafeAreaView
      className="flex-1 justify-center items-center px-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="items-center mb-20">
        <Image
          source={require("@/assets/images/aux/success.png")}
          style={{ width: 100, height: 100 }}
          className="mb-6"
        />
        <Text
          className="text-xl text-center mb-8 px-4"
          style={{ color: theme.textColor }}
        >
          {isGlayze
            ? `Successfully created $${symbol}`
            : isBuy
            ? `Successfully bought ${shares} shares of $${symbol} for $${price}`
            : `Successfully sold ${shares} shares of $${symbol} for $${price}`}
        </Text>
      </View>

      <Button
        buttonStyle="py-4 px-8 rounded-full"
        onPress={() => {
          isGlayze
            ? router.replace(`/(authenticated)/post/${id}`)
            : router.replace("/(authenticated)/home");
        }}
        style={{ backgroundColor: theme.tabBarActiveTintColor }}
      >
        <Text
          className="text-black text-lg font-medium"
          style={{ color: colors.white }}
        >
          {isGlayze ? `View $${symbol}` : "Back to Home"}
        </Text>
      </Button>
    </SafeAreaView>
  );
}
