import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTheme } from "../../../contexts/theme-context";
import { SubHeader } from "@/components/sub-header";
import { PostComponent } from "@/components/post-section";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { client } from "@/utils/dynamic-client";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { useWallet, useBalance } from "@/hooks";

// Define the type for the viewTweets state
type ViewTweetsState = {
  "Your Investments": boolean;
  "X Creator Rewards": boolean;
  "Glayze Creator Rewards": boolean;
};

// Use a type for the keys of ViewTweetsState
type ViewTweetsSectionKey = keyof ViewTweetsState;

export default function Wallet() {
  const { wallets } = useReactiveClient(client);
  const address = wallets.userWallets[0]?.address;
  const { theme, themeName } = useTheme();
  const ref = useRef(null);
  useScrollToTop(ref);
  const router = useRouter();
  const [viewTweets, setViewTweets] = useState<ViewTweetsState>({
    "Your Investments": false,
    "X Creator Rewards": false,
    "Glayze Creator Rewards": false,
  });
  const { data, isLoading, isError } = useWallet(address);
  const { data: balance } = useBalance(address);

  const toggleViewTweets = useCallback((section: ViewTweetsSectionKey) => {
    setViewTweets((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const renderItem = useCallback(
    ({ item, section }: { item: any; section: any }) => {
      if (section.type === "balance") {
        return (
          <View className="flex flex-row justify-between py-2">
            <Text className="text-sm" style={{ color: theme.textColor }}>
              {item.title}
            </Text>
            <Text className="text-sm" style={{ color: theme.textColor }}>
              {item.value}
            </Text>
          </View>
        );
      } else if (section.type === "investment") {
        return (
          <PostComponent post={item} viewTweets={viewTweets[section.title]} />
        );
      }
    },
    [theme.textColor, viewTweets]
  );

  const sections = [
    {
      type: "header",
      data: [{}],
      renderItem: () => (
        <View className="items-center py-8 space-y-4">
          <View className="space-y-4">
            <View>
              <Text
                className="text-xl text-center"
                style={{ color: theme.mutedForegroundColor }}
              >
                Your Balance
              </Text>
              <Text
                className="text-5xl text-center pt-6 font-bold"
                style={{ color: theme.textColor }}
              >
                ${balance ?? 0}
              </Text>
            </View>
            <View className="flex flex-row justify-center">
              <TouchableOpacity onPress={() => router.push("/aux/receive")}>
                <View className="flex flex-col items-center space-y-2">
                  <Image
                    source={
                      themeName === "dark"
                        ? require("@/assets/images/dark/receive.png")
                        : require("@/assets/images/light/receive.png")
                    }
                    className="w-8 h-8"
                  />
                  <Text className="text-lg" style={{ color: theme.textColor }}>
                    Receive
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
    },
    // {
    //   type: "balance",
    //   title: "Total Return",
    //   data: [
    //     {
    //       title: "Investments",
    //       value: `$${user?.current_investments ?? 0}`,
    //     },
    //     {
    //       title: "X Creator Rewards",
    //       value: `$${user?.x_creator_rewards ?? 0}`,
    //     },
    //     {
    //       title: "Glayze Creator Rewards",
    //       value: `$${user?.glayze_creator_rewards ?? 0}`,
    //     },
    //   ],
    // },
    {
      type: "investment",
      title: "Holdings",
      data: data?.holdings || [],
    },
    {
      type: "investment",
      title: "X Posts",
      data: data?.xPosts || [],
    },
    {
      type: "investment",
      title: "Creations",
      data: data?.creations || [],
    },
  ];

  if (isLoading || isError) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <SectionList
        className="p-6"
        contentContainerStyle={{
          paddingBottom: 80, // Adjust this value based on your tab bar height
          paddingTop: 24, // Add some top padding as well
        }}
        ref={ref}
        sections={sections}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false} // Disable sticky headers by default
        renderSectionHeader={({ section }) => {
          if (section.type === "balance" || section.type === "investment") {
            return (
              <View className="flex flex-row justify-between items-center pt-6">
                <SubHeader title={section.title} />
                {section.type === "investment" && (
                  <TouchableOpacity
                    onPress={() => toggleViewTweets(section.title)}
                  >
                    <Text style={{ color: theme.tintColor }}>
                      {viewTweets[section.title] ? "Hide Posts" : "Show Posts"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }
          return null;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}
