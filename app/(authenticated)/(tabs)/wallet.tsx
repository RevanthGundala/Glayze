import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Post, Route } from "../../../utils/types";
import { Menu } from "@/components/menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "../../../contexts/user-context";
import { useTheme } from "../../../contexts/theme-context";
import { usePrivy } from "@/utils/privy";
import {
  GLAYZE_TWITTER,
  GLAYZE_DISCORD,
  GLAYZE_PRIVACY_POLICY,
} from "@/utils/constants";
import { SubHeader } from "@/components/sub-header";
import { SectionList } from "react-native";
import { usePostPrices } from "@/hooks";

export default function Wallet() {
  const { theme, themeName } = useTheme();
  const router = useRouter();
  // const { data, isLoading, error } = useUser();

  // if (isLoading)
  //   return (
  //     <View
  //       className="flex items-center justify-center"
  //       style={{ flex: 1, backgroundColor: theme.backgroundColor }}
  //     >
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // if (error)
  //   return (
  //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
  //       <Text style={{ color: theme.textColor }}>Error loading profile</Text>
  //     </View>
  //   );
  // if (!data)
  //   return (
  //     <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
  //       <Text style={{ color: theme.textColor }}>No profile data found</Text>
  //     </View>
  //   );

  // const { name, handle, profile_pic } = data.db!;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View className="mt-16">
        <View className="items-center py-8 space-y-4">
          {/* <Image
            source={
              profile_pic
                ? { uri: profile_pic }
                : require("@/assets/images/aux/profile.png")
            }
            className="w-16 h-16"
          /> */}
          <View className="w-32 space-y-4">
            <View>
              <Text
                className="text-xl text-center"
                style={{ color: theme.textColor }}
              >
                Total Balance
              </Text>
              <Text
                className="text-2xl text-center py-4 font-bold"
                style={{ color: theme.textColor }}
              >
                $1000
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <TouchableOpacity onPress={() => router.push("/aux/send")}>
                <View className="flex flex-col items-center space-y-2">
                  <Image
                    source={
                      themeName === "dark"
                        ? require("@/assets/images/send.png")
                        : require("@/assets/images/send-dark.png")
                    }
                    className="w-6 h-6"
                  />
                  <Text className="text-sm" style={{ color: theme.textColor }}>
                    Send
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/aux/receive")}>
                <View className="flex flex-col items-center space-y-2">
                  <Image
                    source={
                      themeName === "dark"
                        ? require("@/assets/images/receive.png")
                        : require("@/assets/images/receive-dark.png")
                    }
                    className="w-6 h-6"
                  />
                  <Text className="text-sm" style={{ color: theme.textColor }}>
                    Receive
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="px-8">
          <SectionList
            className="pb-4"
            sections={[
              {
                title: "Total Investments",
                data: [
                  { title: "Individual Value", value: "$1000" },
                  { title: "Your Investments", value: "$1000" },
                  { title: "X Creator Rewards", value: "$1000" },
                  { title: "Glayze Creator Rewards", value: "$1000" },
                ],
              },
            ]}
            renderItem={({ item }) => (
              <Row title={item.title} value={item.value} />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <SubHeader title={title} />
            )}
          />
          <SectionList
            sections={[
              {
                title: "Your Investments",
                data: [
                  { symbol: "$AURA", shares: "1000" },
                  { symbol: "$AURA", shares: "1000" },
                  { symbol: "$AURA", shares: "1000" },
                ],
              },
            ]}
            renderItem={({ item }) => (
              <Investment symbol={item.symbol} shares={item.shares} />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <SubHeader title={title} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

type RowProps = {
  title: string;
  value: string;
};

const Row = ({ title, value }: RowProps) => {
  const { theme } = useTheme();
  return (
    <View className="flex flex-row justify-between py-2">
      <Text className="text-sm" style={{ color: theme.textColor }}>
        {title}
      </Text>
      <Text className="text-sm" style={{ color: theme.textColor }}>
        {value}
      </Text>
    </View>
  );
};

type InvestmentProps = {
  post: Post;
};

const Investment = ({ post }: InvestmentProps) => {
  // const { data, isLoading, error } = usePostPrices(post.post_id, "1D");
  return (
    <View className="flex flex-row justify-between py-2">
      {/* <Text className="text-sm">{post.symbol}</Text>
      <Text className="text-sm">{data?.prices[0].price}</Text> */}
    </View>
  );
};
