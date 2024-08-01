import React, { useState, Fragment } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { EnrichedTweet, EnrichedQuotedTweet } from "react-tweet";
import { MediaAnimatedGif, MediaVideo } from "react-tweet/api";
import { getMediaUrl, getMp4Video } from "./utils";
import { ResizeMode, Video } from "expo-av";

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
    <View className="relative w-full h-full">
      <Video
        source={{ uri: mp4Video.url }}
        posterSource={{ uri: getMediaUrl(media, "small") }}
        className="absolute inset-0 h-full w-full m-0 object-cover object-center"
        useNativeControls={!playButton}
        isMuted
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={(status) => {
          if ("isPlaying" in status && status.isPlaying) {
            setIsPlaying(true);
            setEnded(false);
          } else if ("didJustFinish" in status && status.didJustFinish) {
            setEnded(true);
            setIsPlaying(false);
          } else {
            setIsPlaying(false);
          }
        }}
      />
      {playButton && (
        <View className="flex items-center pt-16">
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-white"
            onPress={() => {
              setPlayButton(false);
              setIsPlaying(true);
              // Play video
            }}
          >
            <Image
              source={require("../../assets/images/play-button.png")}
              className="w-12 h-12"
            />
          </TouchableOpacity>
        </View>
      )}
      {!isPlaying && !ended && (
        <View className="absolute top-3 right-2">
          <TouchableOpacity
            className="flex items-center min-w-[2rem] min-h-[2rem] px-4 rounded-full bg-opacity-75 bg-gray-900"
            onPress={() => {}}
          ></TouchableOpacity>
        </View>
      )}
      {ended && (
        <View className="absolute inset-0 flex items-center justify-center">
          <TouchableOpacity
            className="min-h-[2rem] bg-blue-500 border-blue-500 rounded-full"
            onPress={() => {
              /* Open tweet URL */
            }}
          >
            <Text className="text-white font-bold text-base px-4">
              View replies
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
