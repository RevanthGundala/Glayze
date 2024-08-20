import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAura } from "@/hooks";
import { share } from "@/utils/helpers";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Header } from "@/components/header";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { GlayzeToast } from "@/components/ui/glayze-toast";

export default function Refer() {
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { data: aura, refetch } = useAura(address);
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const copyToClipboard = async () => {
    console.log("Copying to clipboard");
    try {
      if (!address) return;
      await Clipboard.setStringAsync(address);
      Toast.show({
        text1: "Copied to clipboard",
        text2: "Address copied to clipboard",
        type: "success",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error copying to clipboard",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      >
        <GlayzeToast />
        <View className="flex flex-row">
          <Header backArrow />
        </View>
        <View className="flex items-center">
          <Text
            className="font-semibold text-2xl"
            style={{ color: theme.textColor }}
          >
            Refer your friends.
          </Text>
          <Text
            className="font-semibold text-2xl"
            style={{ color: theme.textColor }}
          >
            Earn $AURA.
          </Text>
        </View>
        <View className="flex-col space-y-4 p-6">
          <Text
            className="leading-6"
            style={{ color: theme.mutedForegroundColor }}
          >
            You and your friend both earn 1 $AURA when they make a transaction
            within 14 days of using your code. Use $AURA to pay for transaction
            fees.
          </Text>
          <ReferralCard amount={aura || "0"} />
          <Text
            className="font-medium text-lg pb-2"
            style={{ color: theme.textColor }}
          >
            Share your address
          </Text>
          <Input
            placeholder={address || ""}
            readOnly
            style={{ backgroundColor: theme.textColor }}
          />
          <Button
            buttonStyle="w-full rounded-lg my-4"
            style={{
              backgroundColor: address
                ? theme.tabBarActiveTintColor
                : theme.tabBarInactiveTintColor,
            }}
            onPress={copyToClipboard}
          >
            <Text
              className="text-center font-semibold py-4"
              style={{ color: colors.white }}
            >
              {address ? "Copy" : "There was a problem finding your address"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ReferralCardProps = {
  amount: string;
};

const ReferralCard = ({ amount }: ReferralCardProps) => {
  const { theme } = useTheme();
  return (
    <View
      className="p-6 rounded-3xl my-8 border"
      style={{
        backgroundColor: theme.backgroundColor,
        borderColor: theme.textColor,
      }}
    >
      <Text className="text-xl mb-3" style={{ color: theme.textColor }}>
        Current Balance
      </Text>
      <Text className="text-3xl font-bold" style={{ color: theme.textColor }}>
        {amount} $AURA
      </Text>
    </View>
  );
};
