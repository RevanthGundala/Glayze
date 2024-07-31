import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import type { EnrichedTweet } from "react-tweet";

export const TweetInfoCreatedAt = ({ tweet }: { tweet: EnrichedTweet }) => {
  const createdAt = new Date(tweet.created_at);
  const formattedCreatedAtDate = createdAt.toLocaleDateString();

  return (
    <TouchableOpacity
      className="text-inherit text-xs leading-4"
      onPress={() => Linking.openURL(tweet.url)}
      accessibilityLabel={formattedCreatedAtDate}
    >
      <Text className="text-inherit">{formattedCreatedAtDate}</Text>
    </TouchableOpacity>
  );
};
