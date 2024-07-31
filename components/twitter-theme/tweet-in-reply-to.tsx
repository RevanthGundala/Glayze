import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import { type EnrichedTweet } from "react-tweet";

export const TweetInReplyTo = ({ tweet }: { tweet: EnrichedTweet }) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(tweet.in_reply_to_url || "")}
    className="mb-1 active:underline"
  >
    <Text className="text-[15px] leading-5 text-[#536471] dark:text-[#8B98A5] break-words">
      Replying to @{tweet.in_reply_to_screen_name}
    </Text>
  </TouchableOpacity>
);
