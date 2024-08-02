import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Svg, Path } from "react-native-svg";
// import * as Clipboard from "expo-clipboard";
import type { EnrichedTweet } from "react-tweet";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

export const TweetActionsCopy = ({ tweet }: { tweet: EnrichedTweet }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    // await Clipboard.setStringAsync(tweet.url);
    setCopied(true);
  };

  // useEffect(() => {
  //   if (copied) {
  //     const timeout = setTimeout(() => {
  //       setCopied(false);
  //     }, 6000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [copied]);

  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={handleCopy}
      accessibilityLabel="Copy link"
    >
      <View className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center">
        {copied ? (
          <Svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <Path
              d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"
              fill={theme.mutedForegroundColor}
            />
          </Svg>
        ) : (
          <Svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <Path
              d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"
              fill={theme.mutedForegroundColor}
            />
          </Svg>
        )}
      </View>
      <Text
        style={{ color: theme.textColor, fontFamily: theme.regularFont }}
        className="text-sm font-semibold ml-1"
      >
        {copied ? "Copied!" : "Copy link"}
      </Text>
    </TouchableOpacity>
  );
};
