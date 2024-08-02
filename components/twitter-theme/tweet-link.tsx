import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

type Props = {
  children: ReactNode;
  href: string;
};

export const TweetLink = ({ href, children }: Props) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(href)}
      className="active:underline"
    >
      <Text style={{ color: theme.tintColor, fontFamily: theme.regularFont }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
