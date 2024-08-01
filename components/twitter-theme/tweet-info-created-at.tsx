import React from "react";
import { TouchableOpacity, Text, Linking } from "react-native";
import type { EnrichedTweet } from "react-tweet";
import { formatDate } from "./utils";

export const TweetInfoCreatedAt = ({ tweet }: { tweet: EnrichedTweet }) => {
  const createdAt = new Date(tweet.created_at);
  const formattedCreatedAtDate = formatDate(createdAt);

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
