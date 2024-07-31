import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
};

export const TweetLink = ({ href, children }: Props) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(href)}
    className="active:underline"
  >
    <Text className="font-inherit text-[#1DA1F2] dark:text-[#1D9BF0]">
      {children}
    </Text>
  </TouchableOpacity>
);
