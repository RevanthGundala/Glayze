import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Svg, Path } from "react-native-svg";
import type { EnrichedTweet } from "react-tweet";
import { TweetActionsCopy } from "./tweet-actions-copy";
import { formatNumber } from "./utils";
import { useTheme } from "@/contexts/theme-context";

export const TweetActions = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { theme } = useTheme();
  const favoriteCount = formatNumber(tweet.favorite_count);

  return (
    <View
      className="flex-row items-center pt-1 mt-1 border-t"
      style={{
        borderTopColor: theme.borderColor,
      }}
    >
      <TouchableOpacity
        className="flex-row items-center mr-5"
        onPress={() => Linking.openURL(tweet.like_url)}
        accessibilityLabel={`Like. This Tweet has ${favoriteCount} likes`}
      >
        <View className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center">
          <Svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <Path
              d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
              fill="rgb(249, 24, 128)" // Keeping the exact pink color
            />
          </Svg>
        </View>
        <Text
          style={{ color: theme.textColor }}
          className="text-sm font-semibold ml-1"
        >
          {favoriteCount}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center mr-5"
        onPress={() => Linking.openURL(tweet.reply_url)}
        accessibilityLabel="Reply to this Tweet on Twitter"
      >
        <View className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center">
          <Svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <Path
              d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"
              fill="rgb(29, 155, 240)" // Keeping the exact blue color
            />
          </Svg>
        </View>
        <Text
          style={{ color: theme.textColor }}
          className="text-sm font-semibold ml-1"
        >
          Reply
        </Text>
      </TouchableOpacity>

      <TweetActionsCopy tweet={tweet} />
    </View>
  );
};
