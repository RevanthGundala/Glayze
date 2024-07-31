import React from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import { Svg, Path } from "react-native-svg";
import type { EnrichedTweet } from "react-tweet";
import { TweetInfoCreatedAt } from "./tweet-info-created-at";

export const TweetInfo = ({ tweet }: { tweet: EnrichedTweet }) => (
  <View className="flex flex-row items-center text-gray-500 mt-0.5 flex-wrap">
    <TweetInfoCreatedAt tweet={tweet} />
    <TouchableOpacity
      className="h-8 w-8 ml-auto -mr-1 flex justify-center items-center rounded-full"
      onPress={() =>
        Linking.openURL(
          "https://help.x.com/en/x-for-websites-ads-info-and-privacy"
        )
      }
      accessibilityLabel="Twitter for Websites, Ads Information and Privacy"
    >
      <Svg viewBox="0 0 24 24" className="h-5 w-5 text-current">
        <Path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z" />
      </Svg>
    </TouchableOpacity>
  </View>
);
