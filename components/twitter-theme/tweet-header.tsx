import clsx from "clsx";
import { type EnrichedTweet, type TwitterComponents } from "react-tweet";
import { AvatarImg } from "./avatar-img";
import { VerifiedBadge } from "./verified-badge";
import { View, Text, TouchableOpacity } from "react-native";
import { Svg, Path, G } from "react-native-svg";
import { Link } from "expo-router";
import { Image } from "expo-image";

type Props = {
  tweet: EnrichedTweet;
  components?: TwitterComponents;
};

export const TweetHeader = ({ tweet, components }: Props) => {
  const { user } = tweet;
  return (
    <View className="flex pb-3 overflow-hidden">
      <View className="flex-row items-start px-4 pt-2">
        <Link href={tweet.url} className="relative w-12 mr-3">
          <View
            className={clsx(
              "h-full w-full absolute overflow-hidden rounded-full",
              user.profile_image_shape === "Square" && "rounded-sm"
            )}
          >
            <Image
              source={{ uri: user.profile_image_url_https }}
              alt={user.name}
              className="w-full h-full"
            />
          </View>
          <View className="h-full w-full absolute overflow-hidden rounded-full">
            <View className="h-full w-full transition-colors duration-200 shadow-inner hover:bg-black/15"></View>
          </View>
        </Link>
        <View className="flex-1">
          <Link
            href={tweet.url}
            className="no-underline text-inherit flex items-center hover:underline"
          >
            <View className="font-bold truncate overflow-hidden whitespace-nowrap">
              <Text>{user.name}</Text>
            </View>
            <VerifiedBadge user={user} className="inline-flex" />
          </Link>
          <View className="flex-row items-center">
            <Link
              href={tweet.url}
              className="text-gray-500 no-underline truncate"
            >
              <Text>@{user.screen_name}</Text>
            </Link>
            <Text className="px-1">·</Text>
            <Link
              href={user.follow_url}
              className="text-blue-500 no-underline font-bold hover:underline"
            >
              <Text>Follow</Text>
            </Link>
          </View>
        </View>
        <Link href={tweet.url} className="self-start ml-2">
          <Svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-gray-500 fill-current select-none"
          >
            <G>
              <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </G>
          </Svg>
        </Link>
      </View>
    </View>
  );
};
