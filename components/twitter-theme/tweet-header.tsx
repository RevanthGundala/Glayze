import React from "react";
import clsx from "clsx";
import { type EnrichedTweet, type TwitterComponents } from "react-tweet";
import { AvatarImg } from "./avatar-img";
import { VerifiedBadge } from "./verified-badge";
import { View, Text, TouchableOpacity } from "react-native";
import { Svg, Path, G } from "react-native-svg";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/theme-context"; // Adjust this import path as needed

type Props = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

export const TweetHeader = ({ tweet, components }: Props) => {
  const { user } = tweet;
  const { theme } = useTheme();

  return (
    <View className="flex pb-3 overflow-hidden">
      <View className="flex-row items-start pt-2">
        <Link href={tweet.url} className="mr-3">
          <View className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              source={{
                uri: user.profile_image_url_https,
              }}
              alt={user.name}
              style={{ width: 48, height: 48 }}
              contentFit="cover"
            />
          </View>
        </Link>
        <View className="flex-1">
          <Link
            href={tweet.url}
            className="no-underline text-inherit flex items-center hover:underline"
          >
            <View className="font-bold truncate overflow-hidden whitespace-nowrap">
              <Text style={{ color: theme.textColor }}>{user.name}</Text>
            </View>
            <VerifiedBadge user={user} className="inline-flex" />
          </Link>
          <View className="flex-row items-center">
            <Link href={tweet.url} className="truncate">
              <Text style={{ color: theme.mutedForegroundColor }}>
                @{user.screen_name}
              </Text>
            </Link>
            <Text
              style={{
                color: theme.mutedForegroundColor,
                paddingHorizontal: 4,
              }}
            >
              ·
            </Text>
            <Link href={user.follow_url} className="font-bold hover:underline">
              <Text style={{ color: theme.tintColor }}>Follow</Text>
            </Link>
          </View>
        </View>
        <Link href={tweet.url} className="self-start ml-2">
          <Svg
            viewBox="0 0 24 24"
            style={{ width: 24, height: 24, color: theme.mutedForegroundColor }}
          >
            <G>
              <Path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
              />
            </G>
          </Svg>
        </Link>
      </View>
    </View>
  );
};
