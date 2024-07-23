import React from "react";
import { View, Image } from "react-native";
import { Link } from "expo-router";

export const TopBar = () => {
  return (
    <View className="flex-row justify-between items-center px-4 py-2">
      <Link href="/aux/wallet">
        <Image
          source={require("@/assets/images/aux/wallet.png")}
          className="w-6 h-6 opacity-80"
        />
      </Link>

      <Image
        source={require("@/assets/images/icon.png")}
        className="w-10 h-10"
      />

      <Link href="/aux/refer">
        <Image
          source={require("@/assets/images/aux/refer.png")}
          className="w-6 h-6 opacity-80"
        />
      </Link>
    </View>
  );
};
