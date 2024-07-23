import React from "react";
import { View, Image } from "react-native";
import { Link } from "expo-router";

export const BackArrow = () => {
  return (
    <View className="px-6 py-4">
      <Link href="../">
        <Image
          source={require("@/assets/images/back.png")}
          className="w-4 h-4 opacity-80"
        />
      </Link>
    </View>
  );
};
