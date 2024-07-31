import React from "react";
import { TouchableOpacity, View, Linking } from "react-native";
import type { ReactNode } from "react";
import type { EnrichedQuotedTweet } from "react-tweet";

type Props = { tweet: EnrichedQuotedTweet; children: ReactNode };

export const QuotedTweetContainer = ({ tweet, children }: Props) => (
  <TouchableOpacity
    className="w-full overflow-hidden border border-gray-200 rounded-xl my-2"
    onPress={() => Linking.openURL(tweet.url)}
    activeOpacity={0.7}
  >
    <View className="relative">{children}</View>
  </TouchableOpacity>
);
