import { Text, View, SafeAreaView } from "react-native";
import { TopBar } from "@/components/top-bar";
import { FeedSelector } from "@/components/feed-selector";
import { ScrollView, Animated } from "react-native";
import { PostComponent } from "@/components/post-component";
import { useState, useRef, useEffect } from "react";
import { Post } from "@/utils/types";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { usePosts } from "@/hooks/use-posts";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = ["Trending", "New", "Top"];
  const { data: posts, isLoading, isError } = usePosts(selectedTab);
  const scrollY = useHomeScrollY();
  const { theme } = useTheme();

  if (isLoading)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>Loading...</Text>
      </View>
    );
  if (isError)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>Error loading profile</Text>
      </View>
    );
  if (!posts)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>No profile data found</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme }}>
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
  const { theme } = useTheme();

  return (
    <View>
      {posts.length > 0 ? (
        posts.map((post, i) => <PostComponent key={i} post={post} />)
      ) : (
        <Text style={{ color: theme.textColor }}>No Posts Yet!</Text>
      )}
    </View>
  );
};
