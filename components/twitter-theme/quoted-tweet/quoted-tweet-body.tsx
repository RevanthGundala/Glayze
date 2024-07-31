import React from "react";
import { Text, View } from "react-native";
import type { EnrichedQuotedTweet } from "react-tweet";

type Props = { tweet: EnrichedQuotedTweet };

export const QuotedTweetBody = ({ tweet }: Props) => (
  <View className="px-3">
    <Text className="text-sm font-normal leading-5 break-words">
      {tweet.entities.map((item, i) => (
        <Text key={i}>{item.text}</Text>
      ))}
    </Text>
  </View>
);
