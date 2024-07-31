import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { Post } from "@/utils/types";
import { useEmbeddedTweet, usePostPrices } from "@/hooks";
import { EmbeddedTweet } from "./twitter-theme/embedded-tweet";

type PostComponentProps = {
  post: Post;
};

export const PostComponent = ({ post }: PostComponentProps) => {
  const id = post.post_id;
  const { data: oneHour, isLoading, isError } = usePostPrices(id, "1H");
  const { data: oneDay } = usePostPrices(id, "1D");
  const { data: tweet } = useEmbeddedTweet(post.url);
  return (
    <Link href={`/post/${id}`} asChild>
      <TouchableOpacity className="bg-background border-b-2 border-neutral overflow-hidden">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: post.contract_creator || "" }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
              <View className="ml-2 flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-medium text-white">
                    {post.contract_creator_username || "Unknown"}
                  </Text>
                  <Text className="text-lg text-white">
                    {post.symbol || "N/A"}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">
                    {post.contract_creator_handle || "N/A"}
                  </Text>
                  <Text className="text-white">{post.name || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>
          {tweet && <EmbeddedTweet tweet={tweet} />}
          {/* <Image
            source={{ uri: "https://via.placeholder.com/300x200" }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
          /> */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xl font-bold text-white">
              {post.price != null ? `$${post.price.toFixed(3)}` : "N/A"}
            </Text>
            <View className="flex-row">
              <Text
                className={`mr-2 text-lg ${
                  oneHour?.price_change != null && oneHour?.price_change >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                1H:{" "}
                {oneHour?.price_change != null
                  ? `${oneHour?.price_change.toFixed(2)}%`
                  : "N/A"}
              </Text>
              <Text
                className={`text-lg ${
                  oneDay?.price_change != null && oneDay?.price_change >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                24H:{" "}
                {oneDay?.price_change != null
                  ? `${oneDay?.price_change.toFixed(2)}%`
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
