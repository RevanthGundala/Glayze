import React from "react";
import { View } from "react-native";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

type Props = { className?: string; children: ReactNode };

export const TweetContainer = ({ className, children }: Props) => {
  const { theme } = useTheme();

  return (
    <View
      className={clsx(
        "w-full min-w-[250px] max-w-[550px] overflow-hidden",
        "rounded-xl my-4",
        "relative p-3",
        className
      )}
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        borderWidth: 1,
      }}
    >
      {children}
    </View>
  );
};
