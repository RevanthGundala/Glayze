import { Text, View, SafeAreaView, RefreshControl } from "react-native";
import { TopBar } from "@/components/top-bar";
import { FeedSelector } from "@/components/feed-selector";
import { Animated } from "react-native";
import { useState } from "react";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { useTheme } from "@/contexts/theme-context";
import { PostSection } from "@/components/post-section";
import { useScrollToTop } from "@react-navigation/native";
import { useRef, useEffect } from "react";
import { usePost, usePosts } from "@/hooks";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  // const tabs = ["Trending", "New", "Top"];
  const tabs = ["Trending", "New"];
  const scrollY = useHomeScrollY();
  const ref = useRef(null);
  useScrollToTop(ref);
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, isLoading, isError, refetch } = usePosts(selectedTab);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: 40, // Adjust this value based on your tab bar height
          paddingTop: 16, // Add some top padding as well
        }}
        ref={ref}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      >
        <TopBar />
        <FeedSelector
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <PostSection posts={posts} isLoading={isLoading} isError={isError} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
