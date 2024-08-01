import React from "react";
import { Text, View } from "react-native";
import { type EnrichedTweet } from "react-tweet";
import { TweetLink } from "./tweet-link";
import { useTheme } from "@/contexts/ThemeContext"; // Adjust the import based on your project structure

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => {
  const { theme } = useTheme();

  return (
    <View
      className="text-base font-normal leading-5 my-2 break-words"
      style={{
        direction: tweet.lang === "ar" ? "rtl" : "ltr",
        color: theme.textColor,
      }}
    >
      {tweet.entities.map((item, i) => {
        switch (item.type) {
          case "hashtag":
          case "mention":
          case "url":
          case "symbol":
            return (
              <TweetLink
                key={i}
                href={item.href}
                style={{ color: theme.tintColor }}
              >
                {item.text}
              </TweetLink>
            );
          case "media":
            // Media text is currently never displayed
            return null;
          default:
            return (
              <Text key={i} style={{ color: theme.textColor }}>
                {item.text}
              </Text>
            );
        }
      })}
    </View>
  );
};
