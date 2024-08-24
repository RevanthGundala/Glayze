import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, SafeAreaView, RefreshControl } from "react-native";
import { Animated } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { TopBar } from "@/components/top-bar";
import { FeedSelector } from "@/components/feed-selector";
import { PostSection } from "@/components/post-section";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { useTheme } from "@/contexts/theme-context";
import { usePosts } from "@/hooks";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = useMemo(() => ["Trending", "New"], []);
  const scrollY = useHomeScrollY();
  const ref = useRef(null);
  useScrollToTop(ref);
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, isLoading, isError, refetch } = usePosts(selectedTab);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const scrollHandler = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 16,
        }}
        ref={ref}
        onScroll={scrollHandler}
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
