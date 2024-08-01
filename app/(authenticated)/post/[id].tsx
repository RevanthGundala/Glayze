import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  ImageSourcePropType,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BackArrow } from "@/components/ui/BackArrow";
import { Image } from "expo-image";
import { Graph } from "@/components/graph";
import { Button } from "@/components/ui/Button";
import { BlurView } from "expo-blur";
import { usePost } from "@/hooks/use-post";
import { usePostPrices } from "@/hooks/use-post-prices";
import { Time } from "@/utils/types";
import { usePosition } from "@/hooks/use-position";

export default function Post() {
  const address = "0x1234567890";
  const { id } = useLocalSearchParams();
  const { data: post, isLoading, isError } = usePost(id);
  const [selectedTime, setSelectedTime] = useState<Time>("1H");
  const { data: postPrices } = usePostPrices(
    parseInt(id as string),
    selectedTime
  );
  const { data: position } = usePosition(post, address);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (isError || !post) {
    return <Text>Error loading post</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-row justify-between items-center w-full">
        <BackArrow />
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
          tokens={position?.tokens ?? 0}
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
      <BuySellButtons />
    </SafeAreaView>
  );
}

type PositionProps = {
  marketValue: number;
  tokens: number;
  averageCost: number;
  firstBought: Date;
  todaysReturn: number;
  totalReturn: number;
  todaysReturnPercent: number;
  totalReturnPercent: number;
};

const Position = ({
  marketValue,
  tokens,
  averageCost,
  firstBought,
  todaysReturn,
  totalReturn,
  todaysReturnPercent,
  totalReturnPercent,
}: PositionProps) => {
  return (
    <View className="p-6">
      <Text className="text-white text-2xl font-semibold mb-4">
        Your Position
      </Text>

      <View className="flex-row justify-between mb-2">
        <View className="flex-1">
          <Text className="text-gray-400 text-sm">Market Value</Text>
          <Text className="text-white text-lg">${marketValue}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-gray-400 text-sm">Tokens</Text>
          <Text className="text-white text-lg">{tokens}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <View className="flex-1">
          <Text className="text-gray-400 text-sm">Average Cost</Text>
          <Text className="text-white text-lg">${averageCost}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-gray-400 text-sm">First Bought</Text>
          <Text className="text-white text-lg">
            {firstBought.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-4">
        <Text className="text-gray-400 text-sm">Today's return</Text>
        <Text className="text-green-500 text-lg">
          +${todaysReturn}(+{todaysReturnPercent}%)
        </Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-400 text-sm">Total return</Text>
        <Text className="text-green-500 text-lg">
          +${totalReturn}({totalReturnPercent}%)
        </Text>
      </View>
    </View>
  );
};

const imageMap: Record<string, ImageSourcePropType> = {
  "market-cap": require("@/assets/images/stats/market-cap.png"),
  volume: require("@/assets/images/stats/volume.png"),
  "all-time-high": require("@/assets/images/stats/all-time-high.png"),
  "all-time-low": require("@/assets/images/stats/all-time-low.png"),
  "created-at": require("@/assets/images/stats/created-at.png"),
};

type StatsProps = {
  marketCap: number;
  volume: number;
  allTimeHigh: number;
  // allTimeLow: number;
  createdAt: Date;
};
const Stats = ({
  marketCap,
  volume,
  allTimeHigh,
  // allTimeLow,
  createdAt,
}: StatsProps) => {
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
    // {
    //   title: "All Time Low",
    //   imageKey: "all-time-low",
    //   value: allTimeLow,
    // },
    {
      title: "Created At",
      imageKey: "created-at",
      value: createdAt.toLocaleDateString(),
    },
  ];

  return (
    <View className="p-6">
      <Text className="text-white text-2xl font-semibold mb-4">Stats</Text>
      {stats.map((stat) => (
        <View
          key={stat.title}
          className="flex flex-row justify-between items-center mb-4"
        >
          <View className="flex flex-row items-center space-x-4">
            <Image source={imageMap[stat.imageKey]} className="w-5 h-5" />
            <Text className="text-white text-lg">{stat.title}</Text>
          </View>
          <Text className="text-white text-lg">{stat.value}</Text>
        </View>
      ))}
    </View>
  );
};

const BuySellButtons = () => {
  const router = useRouter();
  return (
    <BlurView
      intensity={10}
      tint="dark"
      className="absolute bottom-0 left-0 right-0"
    >
      <View className="flex-row justify-between p-4 mb-4">
        <Button
          buttonStyle="flex-1 mr-2 bg-white rounded-lg py-3"
          onPress={() => router.navigate("(authenticated)/post/sell")}
        >
          <Text className="text-black text-center font-medium">Sell</Text>
        </Button>
        <Button
          buttonStyle="flex-1 ml-2 bg-primary rounded-lg py-3"
          onPress={() => router.navigate("(authenticated)/post/buy")}
        >
          <Text className="text-black text-center font-medium">Buy</Text>
        </Button>
      </View>
    </BlurView>
  );
};
