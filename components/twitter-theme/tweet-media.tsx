import React from "react";
import { View, TouchableOpacity, Dimensions, Text } from "react-native";
import {
  EnrichedTweet,
  EnrichedQuotedTweet,
  TwitterComponents,
} from "react-tweet";
import { MediaDetails } from "react-tweet/api";
import { TweetMediaVideo } from "./tweet-media-video";
import { getMediaUrl } from "./utils";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MEDIA_MAX_WIDTH = SCREEN_WIDTH * 0.85;
const MEDIA_MAX_HEIGHT = 200; // Reduced height to better fit both items

type TweetMediaProps = {
  tweet: EnrichedTweet;
  components: TwitterComponents | undefined;
};

export const TweetMedia = ({ tweet, components }: TweetMediaProps) => {
  const mediaItems = tweet.mediaDetails || [];

  return (
    <View
      className={`mt-4 rounded-lg border border-gray-200 overflow-hidden`}
      style={{
        width: MEDIA_MAX_WIDTH,
        height: MEDIA_MAX_HEIGHT,
      }}
    >
      <View className="flex-row h-full gap-1">
        {mediaItems.map((media, index) => (
          <View
            key={media.media_url_https}
            className="flex-1 h-full overflow-hidden"
          >
            {media.type === "photo" ? (
              <Image
                source={{ uri: getMediaUrl(media, "small") }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
                accessibilityLabel={media.ext_alt_text || "Image"}
              />
            ) : (
              <TweetMediaVideo tweet={tweet} media={media} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
