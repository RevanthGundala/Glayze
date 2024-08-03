import React from "react";
import { View, Image } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/theme-context";

export const TopBar = () => {
  const { theme } = useTheme();

  return (
    <View
      className="flex-row justify-between items-center px-4 py-2"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <Link href="/aux/profile">
        <Image
          source={require("@/assets/images/aux/profile.png")}
          className="w-6 h-6"
          style={{ opacity: 0.8, tintColor: theme.mutedForegroundColor }}
        />
      </Link>

      <Image
        source={require("@/assets/images/icon.png")}
        className="w-10 h-10"
      />

      <Link href="/aux/refer">
        <Image
          source={require("@/assets/images/aux/refer.png")}
          className="w-6 h-6"
          style={{ opacity: 0.8, tintColor: theme.mutedForegroundColor }}
        />
      </Link>
    </View>
  );
};
