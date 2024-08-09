import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  ImageSourcePropType,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Href } from "expo-router";
import { Image } from "expo-image";
import { Graph } from "@/components/graph";
import { Button } from "@/components/ui/button";
import { BlurView } from "expo-blur";
import { usePost } from "@/hooks/use-post";
import { usePostPrices } from "@/hooks/use-post-prices";
import { Time } from "@/utils/types";
import { usePosition } from "@/hooks/use-position";
import { useTheme } from "@/contexts/theme-context";
import { lightTheme, colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { ShareHeader } from "@/components/share-header";
import { type Post } from "@/utils/types";

export default function Post() {
  const { id } = useLocalSearchParams();
  const { data: post, isLoading, isError } = usePost(id);
  const [selectedTime, setSelectedTime] = useState<Time>("1H");
  const { data: postPrices } = usePostPrices(
    parseInt(id as string),
    selectedTime
  );
  const { data: position } = usePosition(post, "0x1234567890");
  const { theme } = useTheme();
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (isError || !post) {
    return <Text>Error loading post.</Text>;
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row justify-between items-center w-full">
        <Header backArrow />
        <ShareHeader
          name={post?.name}
          symbol={post?.symbol}
          image={post?.contract_creator}
        />
        {/* TODO: Add image */}
        <View className="px-6 py-4">
          {/* <Image
            source={require("@/assets/images/share.png")}
            className="w-6 h-6 opacity-80"
          /> */}
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Graph
          price={post.price ?? 0}
          change={postPrices?.price_change ?? 0}
          symbol={post.symbol ?? ""}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <Position
          marketValue={position?.marketValue ?? 0}
          shares={position?.shares ?? 0}
          averageCost={position?.averageCost ?? 0}
          firstBought={position?.firstBought ?? new Date()}
          todaysReturn={position?.todaysReturn ?? 0}
          totalReturn={position?.totalReturn ?? 0}
          todaysReturnPercent={position?.todaysReturnPercent ?? 0}
          totalReturnPercent={position?.totalReturnPercent ?? 0}
        />
        <Stats
          marketCap={post.market_cap ?? 0}
          volume={post.volume ?? 0}
          allTimeHigh={post.ath ?? 0}
          // allTimeLow={0}
          createdAt={new Date(post.created_at)}
        />
      </ScrollView>
      <BuySellButtons theme={theme} post={post} />
    </SafeAreaView>
  );
}

type PositionProps = {
  marketValue: number;
  shares: number;
  averageCost: number;
  firstBought: Date;
  todaysReturn: number;
  totalReturn: number;
  todaysReturnPercent: number;
  totalReturnPercent: number;
};

const Position = ({
  marketValue,
  shares,
  averageCost,
  firstBought,
  todaysReturn,
  totalReturn,
  todaysReturnPercent,
  totalReturnPercent,
}: PositionProps) => {
  const { theme } = useTheme();
  return (
    <View className="p-6">
      <Text
        className="text-2xl font-semibold mb-4"
        style={{ color: theme.textColor }}
      >
        Your Position
      </Text>

      <View className="flex-row justify-between mb-2">
        <View className="flex-1">
          <Text
            className="text-sm"
            style={{ color: theme.mutedForegroundColor }}
          >
            Market Value
          </Text>
          <Text className="text-lg" style={{ color: theme.textColor }}>
            ${marketValue}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text
            className="text-sm"
            style={{ color: theme.mutedForegroundColor }}
          >
            Shares
          </Text>
          <Text className="text-lg" style={{ color: theme.textColor }}>
            ${shares}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <View className="flex-1">
          <Text
            className="text-sm"
            style={{ color: theme.mutedForegroundColor }}
          >
            Average Cost
          </Text>
          <Text className="text-lg" style={{ color: theme.textColor }}>
            ${averageCost}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text
            className="text-sm"
            style={{ color: theme.mutedForegroundColor }}
          >
            First Bought
          </Text>
          <Text className="text-lg" style={{ color: theme.textColor }}>
            {firstBought.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-4">
        <Text className="text-sm" style={{ color: theme.mutedForegroundColor }}>
          Today's return
        </Text>
        <Text
          className="text-lg"
          style={{
            color:
              todaysReturn >= 0 ? colors.greenTintColor : colors.redTintColor,
          }}
        >
          +${todaysReturn}(+{todaysReturnPercent}%)
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm" style={{ color: theme.mutedForegroundColor }}>
          Total return
        </Text>
        <Text
          className="text-lg"
          style={{
            color:
              totalReturn >= 0 ? colors.greenTintColor : colors.redTintColor,
          }}
        >
          +${totalReturn}({totalReturnPercent}%)
        </Text>
      </View>
    </View>
  );
};

const darkImageMap: Record<string, ImageSourcePropType> = {
  "market-cap": require("@/assets/images/dark/market-cap.png"),
  volume: require("@/assets/images/dark/volume.png"),
  "all-time-high": require("@/assets/images/dark/all-time-high.png"),
  // "all-time-low": require("@/assets/images/stats/all-time-low.png"),
  "created-at": require("@/assets/images/dark/created-at.png"),
};

const lightImageMap: Record<string, ImageSourcePropType> = {
  "market-cap": require("@/assets/images/light/market-cap.png"),
  volume: require("@/assets/images/light/volume.png"),
  "all-time-high": require("@/assets/images/light/all-time-high.png"),
  // "all-time-low": require("@/assets/images/stats/all-time-low-dark.png"),
  "created-at": require("@/assets/images/light/created-at.png"),
};

type StatsProps = {
  marketCap: number;
  volume: number;
  allTimeHigh: number;
  createdAt: Date;
};
const Stats = ({ marketCap, volume, allTimeHigh, createdAt }: StatsProps) => {
  const { theme, themeName } = useTheme();
  type Stat = {
    title: string;
    imageKey: string;
    value: number | string;
  };
  const stats: Stat[] = [
    {
      title: "Market Cap",
      imageKey: "market-cap",
      value: marketCap,
    },
    {
      title: "Volume",
      imageKey: "volume",
      value: volume,
    },
    {
      title: "All Time High",
      imageKey: "all-time-high",
      value: allTimeHigh,
    },
    {
      title: "Created At",
      imageKey: "created-at",
      value: createdAt.toLocaleDateString(),
    },
  ];

  return (
    <View className="p-6">
      <Text
        className="text-2xl font-semibold mb-4"
        style={{ color: theme.textColor }}
      >
        Stats
      </Text>
      {stats.map((stat) => (
        <View
          key={stat.title}
          className="flex flex-row justify-between items-center mb-4"
        >
          <View className="flex flex-row items-center space-x-4">
            <Image
              source={
                themeName === "dark"
                  ? darkImageMap[stat.imageKey]
                  : lightImageMap[stat.imageKey]
              }
              className="w-5 h-5"
            />
            <Text className="text-lg" style={{ color: theme.textColor }}>
              {stat.title}
            </Text>
          </View>
          <Text className="text-lg" style={{ color: theme.textColor }}>
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

type BuySellButtonsProps = {
  theme: typeof lightTheme;
  post: Post;
};

const BuySellButtons = ({ theme, post }: BuySellButtonsProps) => {
  const router = useRouter();
  return (
    <BlurView
      intensity={10}
      tint="dark"
      className="absolute bottom-0 left-0 right-0"
    >
      <View className="flex-row justify-between p-4 mb-4 space-x-2">
        <Button
          buttonStyle={`flex-1 rounded-lg`}
          style={{ backgroundColor: theme.tabBarInactiveTintColor }}
          onPress={() => {
            router.push({
              pathname: "/(authenticated)/post/sell",
              params: {
                key1: post.post_id,
                key2: post.name,
                key3: post.symbol,
                key4: post.contract_creator, // TODO: Add image
              },
            });
          }}
        >
          <Text
            className={`text-center font-medium py-4`}
            style={{ color: colors.white }}
          >
            Sell
          </Text>
        </Button>
        <Button
          buttonStyle={`flex-1 rounded-lg`}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
          onPress={() => {
            router.push({
              pathname: "/(authenticated)/post/buy",
              params: {
                key1: post.post_id,
                key2: post.name,
                key3: post.symbol,
                key4: post.contract_creator, // TODO: Add image
              },
            });
          }}
        >
          <Text
            className={`text-center font-semibold py-4`}
            style={{ color: colors.white }}
          >
            Buy
          </Text>
        </Button>
      </View>
    </BlurView>
  );
};
