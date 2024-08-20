import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  ImageSourcePropType,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Graph } from "@/components/graph";
import { Button } from "@/components/ui/button";
import { BlurView } from "expo-blur";
import { usePost } from "@/hooks/use-post";
import { usePosition } from "@/hooks/use-position";
import { useTheme } from "@/contexts/theme-context";
import { lightTheme, colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { ShareHeader } from "@/components/share-header";
import { type Post } from "@/utils/types";
import { useShareInfo, useShares } from "@/hooks";
import { Loading } from "@/components/loading";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { formatUSDC } from "@/utils/helpers";

export default function Post() {
  const { id } = useLocalSearchParams();
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { data: post, isLoading, isError, refetch } = usePost(id);
  const { theme } = useTheme();
  const {
    data: shareInfo,
    isLoading: shareInfoLoading,
    isError: shareInfoError,
  } = useShareInfo(id as string);

  const { data: shares, refetch: refetchShares } = useShares(
    address,
    id as string
  );
  const { data: position } = usePosition(
    post,
    address,
    shareInfo?.price,
    shares?.number,
    shares?.value
  );

  const navigation = useNavigation();
  const image = `${process.env.EXPO_PUBLIC_IPFS_GATEWAY}/ipfs/${post?.image_uri}`;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Refetch data when the screen comes into focus
      if (typeof id === "string") {
        refetch();
        refetchShares();
      }
    });

    return unsubscribe;
  }, [navigation, id]);

  if (isLoading || isError || !post || shareInfoLoading || shareInfoError)
    return <Loading error={isError ? "Error loading post" : null} />;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row justify-between items-center w-full">
        <Header backArrow />
        <ShareHeader name={post?.name} symbol={post?.symbol} image={image} />
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
        <Graph price={shareInfo?.price} />
        <Position
          marketValue={formatUSDC(shares?.value ?? "0")}
          shares={shares?.number ?? "0"}
          averageCost={formatUSDC(position?.averageCost ?? "0")}
          firstBought={position?.firstBought ?? new Date()}
          todaysReturn={position?.todaysReturn ?? 0n}
          totalReturn={position?.totalReturn ?? 0n}
          todaysReturnPercent={position?.todaysReturnPercent ?? 0n}
          totalReturnPercent={position?.totalReturnPercent ?? 0n}
        />
        {/* <Stats
          marketCap={(shareInfo && shareInfo?.price * shareInfo?.supply) ?? 0}
          volume={post.volume ?? 0}
          allTimeHigh={post.ath ?? 0}
          // allTimeLow={0}
          createdAt={new Date(post.created_at)}
        /> */}
      </ScrollView>
      <BuySellButtons theme={theme} post={post} image={image} />
    </SafeAreaView>
  );
}

type PositionProps = {
  marketValue: string;
  shares: string;
  averageCost: string;
  firstBought: Date;
  todaysReturn: bigint;
  totalReturn: bigint;
  todaysReturnPercent: bigint;
  totalReturnPercent: bigint;
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
            {shares}
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
            ${formatUSDC(averageCost)}
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

      {/* <View className="flex-row justify-between mt-4">
        <Text className="text-sm" style={{ color: theme.mutedForegroundColor }}>
          Today's return
        </Text>
        <Text
          className="text-lg"
          style={{
            color:
              todaysReturnPercent >= 0
                ? colors.greenTintColor
                : colors.redTintColor,
          }}
        >
          +${todaysReturn}(
          {todaysReturnPercent >= 0
            ? `+${formatUSDC(todaysReturnPercent.toString())}%`
            : `-${formatUSDC(todaysReturnPercent.toString())}%`}
          )
        </Text>
      </View> */}

      <View className="flex-row justify-between">
        <Text className="text-sm" style={{ color: theme.mutedForegroundColor }}>
          Total return
        </Text>
        <Text
          className="text-lg"
          style={{
            color:
              totalReturnPercent >= 0
                ? colors.greenTintColor
                : colors.redTintColor,
          }}
        >
          {totalReturnPercent >= 0
            ? `+$${formatUSDC(totalReturn.toString())}(+${formatUSDC(
                totalReturnPercent.toString()
              )}%)`
            : `-$${formatUSDC(totalReturn.toString())}(-${formatUSDC(
                totalReturnPercent.toString()
              )}%)`}
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
  image: string;
};

const BuySellButtons = ({ theme, post, image }: BuySellButtonsProps) => {
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
                id: post.post_id as string,
                name: post.name as string,
                symbol: post.symbol as string,
                image,
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
                id: post.post_id as string,
                name: post.name as string,
                symbol: post.symbol as string,
                image,
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
