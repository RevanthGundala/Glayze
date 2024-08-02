import React from "react";
import { TouchableWithoutFeedback, View, Image, Text } from "react-native";
import { Link } from "expo-router";
import { usePostPrices } from "@/hooks";
import { EmbeddedTweet } from "./twitter-theme/embedded-tweet";
import { useEmbeddedTweet } from "@/hooks";
import { Post } from "@/utils/types";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";

type PostComponentProps = {
  post: Post;
};

export const PostComponent = ({ post }: PostComponentProps) => {
  const id = post.post_id;
  const { data: oneHour } = usePostPrices(id, "1H");
  const { data: oneDay } = usePostPrices(id, "1D");
  const { data: tweet } = useEmbeddedTweet(post.url);
  const { theme } = useTheme();

  return (
    <View
      className="border-b-2 overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
      }}
    >
      <Link href={`/post/${id}`} asChild>
        <TouchableWithoutFeedback>
          <View className="p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: post.contract_creator || "" }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <View className="ml-2 flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      {post.contract_creator_username || "Unknown"}
                    </Text>
                    <Text
                      className="text-lg font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      ${post.symbol || "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text style={{ color: theme.mutedForegroundColor }}>
                      {post.contract_creator_handle || "N/A"}
                    </Text>
                    <Text style={{ color: theme.mutedForegroundColor }}>
                      {post.name || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Link>

      {tweet && (
        <View className="px-3">
          <EmbeddedTweet tweet={tweet} />
        </View>
      )}

      <Link href={`/post/${id}`} asChild>
        <TouchableWithoutFeedback>
          <View className="px-4 pb-4">
            <View className="flex-row justify-between items-center mt-2">
              <Text
                className="text-xl font-bold"
                style={{ color: theme.textColor }}
              >
                {post.price != null ? `$${post.price.toFixed(3)}` : "N/A"}
              </Text>
              <View className="flex-row">
                <Text
                  className={`mr-2 text-lg`}
                  style={{
                    color:
                      oneHour?.price_change != null &&
                      oneHour?.price_change >= 0
                        ? colors.greenTintColor
                        : colors.redTintColor,
                  }}
                >
                  1H:{" "}
                  {oneHour?.price_change != null
                    ? `${oneHour?.price_change.toFixed(2)}%`
                    : "N/A"}
                </Text>
                <Text
                  className={`text-lg`}
                  style={{
                    color:
                      oneDay?.price_change != null && oneDay?.price_change >= 0
                        ? colors.greenTintColor
                        : colors.redTintColor,
                  }}
                >
                  24H:{" "}
                  {oneDay?.price_change != null
                    ? `${oneDay?.price_change.toFixed(2)}%`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Link>
    </View>
  );
};
