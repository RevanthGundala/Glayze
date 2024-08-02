import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import type { EnrichedTweet } from "react-tweet";
import { formatDate } from "./utils";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

export const TweetInfoCreatedAt = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { theme } = useTheme();
  const createdAt = new Date(tweet.created_at);
  const formattedCreatedAtDate = formatDate(createdAt);

  return (
    <TouchableOpacity
      className="text-xs leading-4"
      onPress={() => Linking.openURL(tweet.url)}
      accessibilityLabel={formattedCreatedAtDate}
    >
      <Text style={{ color: theme.mutedForegroundColor }}>
        {formattedCreatedAtDate}
      </Text>
    </TouchableOpacity>
  );
};
