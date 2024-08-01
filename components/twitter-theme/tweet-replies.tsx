import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import type { EnrichedTweet } from "react-tweet";
import { formatNumber } from "./utils";
import { useTheme } from "@/contexts/ThemeContext";

export const TweetReplies = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { theme } = useTheme();

  const getLinkText = () => {
    if (tweet.conversation_count === 0) {
      return "Read more on X";
    } else if (tweet.conversation_count === 1) {
      return `Read ${formatNumber(tweet.conversation_count)} reply`;
    } else {
      return `Read ${formatNumber(tweet.conversation_count)} replies`;
    }
  };

  return (
    <View className="py-1">
      <TouchableOpacity
        className="flex items-center justify-center min-w-[32px] min-h-[32px] px-4 rounded-full"
        style={{
          borderWidth: 1,
          borderColor: theme.borderColor,
          backgroundColor: theme.backgroundColor,
        }}
        onPress={() => Linking.openURL(tweet.url)}
      >
        <Text className="font-semibold text-sm text-blue-400 truncate">
          {getLinkText()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
