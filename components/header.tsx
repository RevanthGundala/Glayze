import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/theme-context";
import { BackArrow } from "./ui/back-arrow";

type HeaderProps = {
  title?: string;
  backArrow?: true;
};

export const Header = ({ title, backArrow }: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <View className="flex flex-row py-4 justify-center h-16">
      {backArrow && (
        <View className="px-6">
          <BackArrow />
        </View>
      )}
      {title && (
        <Text
          className="text-2xl"
          style={{ color: theme.textColor, fontWeight: theme.boldFont }}
        >
          {title}
        </Text>
      )}
    </View>
  );
};
