import React, { useState, Fragment } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { EnrichedTweet, EnrichedQuotedTweet } from "react-tweet";
import { MediaAnimatedGif, MediaVideo } from "react-tweet/api";
import { getMediaUrl, getMp4Video } from "./utils";
import { Video } from "expo-av";

type TweetMediaVideoProps = {
  tweet: EnrichedTweet | EnrichedQuotedTweet;
  media: MediaAnimatedGif | MediaVideo;
};

export const TweetMediaVideo = ({ tweet, media }: TweetMediaVideoProps) => {
  const [playButton, setPlayButton] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const mp4Video = getMp4Video(media);

  return (
    <>
      <Video
        source={{ uri: mp4Video.url }}
        posterSource={{ uri: getMediaUrl(media, "small") }}
        className="absolute inset-0 h-full w-full m-0 object-cover object-center"
        useNativeControls={!playButton}
        isMuted
        resizeMode="cover"
        onPlaybackStatusUpdate={(status) => {
          if (status.isPlaying) {
            setIsPlaying(true);
            setEnded(false);
          } else if (status.didJustFinish) {
            setEnded(true);
            setIsPlaying(false);
          } else {
            setIsPlaying(false);
          }
        }}
      />
      {playButton && (
        <TouchableOpacity
          className="relative h-[67px] w-[67px] flex items-center justify-center bg-blue-500 border-4 border-white rounded-full"
          onPress={() => {
            setPlayButton(false);
            setIsPlaying(true);
            // Play video
          }}
        >
          <View className="ml-[3px] w-[50%] h-[50%]">
            {/* Play icon SVG */}
          </View>
        </TouchableOpacity>
      )}
      {!isPlaying && !ended && (
        <View className="absolute top-3 right-2">
          <TouchableOpacity
            className="flex items-center min-w-[2rem] min-h-[2rem] px-4 rounded-full bg-opacity-75 bg-gray-900"
            onPress={() => {
              /* Open tweet URL */
            }}
          >
            <Text className="text-white font-bold text-sm">
              {playButton ? "Watch on X" : "Continue watching on X"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {ended && (
        <TouchableOpacity
          className="relative min-h-[2rem] bg-blue-500 border-blue-500 rounded-full"
          onPress={() => {
            /* Open tweet URL */
          }}
        >
          <Text className="text-white font-bold text-base px-4">
            View replies
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
