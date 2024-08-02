import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import { type EnrichedTweet } from "react-tweet";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

export const TweetInReplyTo = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(tweet.in_reply_to_url || "")}
      className="mb-1 active:underline"
    >
      <Text
        className="text-[15px] leading-5 break-words"
        style={{ color: theme.mutedForegroundColor }}
      >
        Replying to @{tweet.in_reply_to_screen_name}
      </Text>
    </TouchableOpacity>
  );
};
