import { Text, View, SafeAreaView } from "react-native";
import { TopBar } from "@/components/TopBar";
import { FeedSelector } from "@/components/FeedSelector";
import { ScrollView, Animated } from "react-native";
import { ItemComponent } from "@/components/ItemComponent";
import { useState, useRef, useEffect } from "react";
import { Item } from "@/types/types";
import { useHomeScrollY } from "@/hooks/useHomeScrollY";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const scrollY = useHomeScrollY();

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
        <FeedSelector setItems={setItems} />
        <ItemSection items={items} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

type ItemSectionProps = {
  items: Item[];
};

const ItemSection = ({ items }: ItemSectionProps) => {
  return (
    <View>
      {items.length > 0 ? (
        items.map((item, i) => <ItemComponent key={i} item={item} />)
      ) : (
        <Text>No Tweets Yet!</Text>
      )}
    </View>
  );
};
