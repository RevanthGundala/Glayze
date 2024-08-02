import { Text, View, SafeAreaView } from "react-native";
import { TopBar } from "@/components/top-bar";
import { FeedSelector } from "@/components/feed-selector";
import { Animated } from "react-native";
import { PostComponent } from "@/components/post-component";
import { useState } from "react";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { usePosts } from "@/hooks/use-posts";
import { useTheme } from "@/contexts/theme-context";
import { Instagram } from "react-content-loader/native";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = ["Trending", "New", "Top"];
  const scrollY = useHomeScrollY();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
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
        <PostSection selectedTab={selectedTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

type PostSectionProps = {
  selectedTab: string;
};

const PostSection = ({ selectedTab }: PostSectionProps) => {
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
        posts.map((post, i) => <PostComponent key={i} post={post} />)
      ) : (
        <Text style={{ color: theme.textColor }}>
          {isError ? "Error loading posts" : "No posts yet!"}
        </Text>
      )}
    </View>
  );
};
