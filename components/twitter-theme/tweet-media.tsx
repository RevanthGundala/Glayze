import React, { useState, Fragment } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { EnrichedTweet, EnrichedQuotedTweet } from "react-tweet";
import { MediaDetails } from "react-tweet/api";
import { TweetMediaVideo } from "./tweet-media-video";

const getMediaUrl = () => {};

const getSkeletonStyle = (media: MediaDetails, itemCount: number) => {
  let paddingBottom = 56.25; // default of 16x9
  if (itemCount === 1) {
    paddingBottom =
      (100 / media.original_info.width) * media.original_info.height;
  }
  if (itemCount === 2) {
    paddingBottom = paddingBottom * 2;
  }
  return {
    width: media.type === "photo" ? undefined : "auto",
    paddingBottom: `${paddingBottom}%`,
  };
};

type TweetMediaProps = {
  tweet: EnrichedTweet | EnrichedQuotedTweet;
  components?: any;
  quoted?: boolean;
};

export const TweetMedia = ({ tweet, components, quoted }: TweetMediaProps) => {
  const length = tweet.mediaDetails?.length ?? 0;
  const Img = components?.MediaImg ?? Image;

  return (
    <View
      className={`mt-3 overflow-hidden relative ${
        !quoted && "rounded-xl border border-gray-300"
      }`}
    >
      <View
        className={`grid grid-rows-1 gap-0.5 h-full w-full ${
          length > 1 && "grid-cols-2"
        } ${length === 3 && "grid-rows-2"} ${
          length > 4 && "grid-rows-2 grid-cols-2"
        }`}
      >
        {tweet.mediaDetails?.map((media) => (
          <Fragment key={media.media_url_https}>
            {media.type === "photo" ? (
              <TouchableOpacity
                className="relative h-full w-full flex items-center justify-center"
                onPress={() => {
                  /* Open tweet URL */
                }}
              >
                <View
                  style={getSkeletonStyle(media, length)}
                  className="w-full"
                />
                <Img
                  source={{ uri: getMediaUrl(media, "small") }}
                  className="absolute inset-0 h-full w-full m-0 object-cover object-center"
                  accessibilityLabel={media.ext_alt_text || "Image"}
                />
              </TouchableOpacity>
            ) : (
              <View className="relative h-full w-full flex items-center justify-center">
                <View
                  style={getSkeletonStyle(media, length)}
                  className="w-full"
                />
                <TweetMediaVideo tweet={tweet} media={media} />
              </View>
            )}
          </Fragment>
        ))}
      </View>
    </View>
  );
};
