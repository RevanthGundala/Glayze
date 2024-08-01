import React from "react";
import { View } from "react-native";
import type { ReactNode } from "react";
import clsx from "clsx";

type Props = { className?: string; children: ReactNode };

export const TweetContainer = ({ className, children }: Props) => (
  <View
    className={clsx(
      "w-full min-w-[250px] max-w-[550px] overflow-hidden",
      "text-[#0F1419] dark:text-[#E7E9EA]", // Assuming these are your light/dark text colors
      "font-sans font-normal",
      "border border-[#CFD9DE] dark:border-[#2F3336]", // Assuming these are your light/dark border colors
      "rounded-xl my-4",
      "bg-white dark:bg-black", // Assuming white background for light mode, black for dark mode
      className
    )}
  >
    <View className="relative p-3 ">{children}</View>
  </View>
);
