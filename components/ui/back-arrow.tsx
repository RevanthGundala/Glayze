import React from "react";
import { View, Image } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/theme-context";

export const BackArrow = () => {
  const { themeName } = useTheme();
  return (
    <Link href="../">
      <View className="p-2">
        {/* Increased padding around the image */}
        {themeName === "dark" ? (
          <Image
            source={require("@/assets/images/back.png")}
            className="w-4 h-4"
          />
        ) : (
          <Image
            source={require("@/assets/images/back-dark.png")}
            className="w-4 h-4"
          />
        )}
      </View>
    </Link>
  );
};
