import React from "react";
import { TouchableWithoutFeedback, View, Image, Text } from "react-native";
import { Link } from "expo-router";
import { usePostPrices } from "@/hooks";
import { EmbeddedTweet } from "./twitter-theme/embedded-tweet";
import { useEmbeddedTweet, useShareInfo } from "@/hooks";
import { Post } from "@/utils/types";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { usePosts } from "@/hooks/use-posts";
import { Instagram } from "react-content-loader/native";
import { formatUSDC } from "@/utils/helpers";

type PostSectionProps = {
  selectedTab: string;
};

export const PostSection = ({ selectedTab }: PostSectionProps) => {
  const { theme } = useTheme();
  const { data: posts, isLoading, isError } = usePosts(selectedTab);

  return (
    <View>
      {isLoading ? (
        // Render multiple Instagram loaders to simulate loading multiple posts
        Array.from({ length: 3 }).map((_, index) => (
          <Instagram
            key={index}
            backgroundColor={theme.backgroundColor}
            foregroundColor={theme.secondaryBackgroundColor}
          />
        ))
      ) : posts && posts.length > 0 ? (
        posts.map((post, i) => (
          <PostComponent
            key={i}
            post={post}
            viewTweets={true}
            border={i !== posts.length - 1}
          />
        ))
      ) : (
        <Text style={{ color: theme.textColor }}>
          {isError ? "Error loading posts" : "No posts yet!"}
        </Text>
      )}
    </View>
  );
};
type PostComponentProps = {
  post: Post;
  viewTweets: boolean;
  border?: boolean;
};

export const PostComponent = ({
  post,
  viewTweets,
  border,
}: PostComponentProps) => {
  const { data: oneHour } = usePostPrices(post.post_id, "1H");
  const { data: tweet, isLoading, isError } = useEmbeddedTweet(post.url);
  const { data: shareInfo } = useShareInfo(post.post_id);
  const { theme } = useTheme();

  return (
    <View
      className={border ? "border-b overflow-hidden" : "overflow-hidden"}
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
      }}
    >
      <Link href={`/post/${post.post_id}`} asChild>
        <TouchableWithoutFeedback>
          <View className={viewTweets ? "pt-4 px-4" : "pt-4"}>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View
                  className="border rounded-full overflow-hidden p-1"
                  style={{ borderColor: theme.mutedForegroundColor }}
                >
                  <Image
                    source={{ uri: `${post.image_uri}` || "" }}
                    className="w-10 h-10"
                  />
                </View>
                <View className="ml-2 flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-lg"
                      style={{ color: theme.textColor }}
                    >
                      {post.symbol || "N/A"}
                    </Text>
                    <Text
                      className="text-xl font-semibold"
                      style={{ color: theme.textColor }}
                    >
                      {shareInfo
                        ? `$${formatUSDC(shareInfo?.price || "0")}`
                        : "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center mt-[-2]">
                    {/* Added negative top margin */}
                    <Text style={{ color: theme.mutedForegroundColor }}>
                      {post.name || "N/A"}
                    </Text>
                    {oneHour && oneHour.price_change >= 0 ? (
                      <View className="flex flex-row items-center space-x-1">
                        <Image
                          source={require("@/assets/images/aux/up-arrow.png")}
                          className="w-4 h-4"
                        />
                        <Text
                          className="text-lg"
                          style={{ color: colors.greenTintColor }}
                        >
                          {oneHour?.price_change.toFixed(2)}%
                        </Text>
                      </View>
                    ) : (
                      <View className="flex flex-row items-center space-x-1">
                        <Image
                          source={require("@/assets/images/aux/down-arrow.png")}
                          className="w-4 h-4"
                        />
                        <Text
                          className="text-lg"
                          style={{ color: colors.redTintColor }}
                        >
                          {oneHour?.price_change.toFixed(2)}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Link>

      {viewTweets
        ? tweet && (
            <View className="px-3">
              <EmbeddedTweet tweet={tweet} />
            </View>
          )
        : null}
    </View>
  );
};
