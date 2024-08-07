import { Text, View, SafeAreaView } from "react-native";
import { TopBar } from "@/components/top-bar";
import { FeedSelector } from "@/components/feed-selector";
import { Animated } from "react-native";
import { useState } from "react";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { useTheme } from "@/contexts/theme-context";
import { PostSection } from "@/components/post-section";
import { useScrollToTop } from "@react-navigation/native";
import { useRef, useEffect } from "react";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = ["Trending", "New", "Top"];
  const scrollY = useHomeScrollY();
  const ref = useRef(null);
  useScrollToTop(ref);
  const { theme } = useTheme();

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
      >
        <TopBar />
        <FeedSelector
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <PostSection selectedTab={selectedTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
