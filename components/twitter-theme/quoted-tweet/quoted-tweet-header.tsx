import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { AvatarImg } from "../avatar-img";
import type { EnrichedQuotedTweet } from "react-tweet";
import { VerifiedBadge } from "../verified-badge";

type Props = { tweet: EnrichedQuotedTweet };

export const QuotedTweetHeader = ({ tweet }: Props) => {
  const { user } = tweet;

  return (
    <View className="flex-row px-3 pt-3 pb-0 leading-5 text-sm overflow-hidden">
      <TouchableOpacity
        className="relative h-5 w-5"
        onPress={() => Linking.openURL(tweet.url)}
      >
        <View
          className={`overflow-hidden ${
            user.profile_image_shape === "Square" ? "rounded" : "rounded-full"
          }`}
        >
          <AvatarImg
            src={user.profile_image_url_https}
            alt={user.name}
            width={20}
            height={20}
          />
        </View>
      </TouchableOpacity>
      <View className="flex-row mx-2">
        <View className="flex-row items-center">
          <Text className="font-bold truncate" numberOfLines={1}>
            {user.name}
          </Text>
          <VerifiedBadge user={user} />
          <Text className="text-gray-500 ml-0.5 truncate" numberOfLines={1}>
            @{user.screen_name}
          </Text>
        </View>
      </View>
    </View>
  );
};
