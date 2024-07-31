import { Text, View, SafeAreaView } from "react-native";
import { TopBar } from "@/components/TopBar";
import { FeedSelector } from "@/components/FeedSelector";
import { ScrollView, Animated } from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { useState, useRef, useEffect } from "react";
import { Post } from "@/utils/types";
import { useHomeScrollY } from "@/hooks/useHomeScrollY";
import { usePosts } from "@/hooks/usePosts";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = ["Trending", "New", "Top"];
  const { data: posts, isLoading, isError } = usePosts(selectedTab);
  const scrollY = useHomeScrollY();

  if (isLoading)
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 bg-background">
        <Text>Error loading profile</Text>
      </View>
    );
  if (!posts)
    return (
      <View className="flex-1 bg-background">
        <Text>No profile data found</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
      >
        <TopBar />
        <FeedSelector
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <PostSection posts={posts} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

type PostSectionProps = {
  posts: Post[];
};

const PostSection = ({ posts }: PostSectionProps) => {
  return (
    <View>
      {posts.length > 0 ? (
        posts.map((post, i) => <PostComponent key={i} post={post} />)
      ) : (
        <Text>No Posts Yet!</Text>
      )}
    </View>
  );
};
