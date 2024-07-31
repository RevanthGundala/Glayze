import React from "react";
import { Text, View } from "react-native";
import { type EnrichedTweet } from "react-tweet";
import { TweetLink } from "./tweet-link";
export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
  <View
    className="text-base font-normal leading-5 my-2 break-words"
    style={{ direction: tweet.lang === "ar" ? "rtl" : "ltr" }}
  >
    {tweet.entities.map((item, i) => {
      switch (item.type) {
        case "hashtag":
        case "mention":
        case "url":
        case "symbol":
          return (
            <TweetLink key={i} href={item.href}>
              {item.text}
            </TweetLink>
          );
        case "media":
          // Media text is currently never displayed
          return null;
        default:
          return <Text key={i}>{item.text}</Text>;
      }
    })}
  </View>
);
