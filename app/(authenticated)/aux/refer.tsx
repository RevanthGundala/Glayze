import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/input";
import { BackArrow } from "@/components/ui/back-arrow";
import { Button } from "@/components/ui/button";
import { useReferral } from "@/hooks";
import { share } from "@/utils/helpers";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";

export default function Refer() {
  const [auraAmount, setAuraAmount] = useState(20); // TODO: Fetch from API
  const address = "0x1234567890"; // TODO: Fetch from API
  const { data } = useReferral(address);
  const { theme } = useTheme();
  const handlePress = async () => {
    // TODO: Implement referral functionality
    await share(data?.referralLink || null);
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <BackArrow />
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
          You and your friend both earn 5 $AURA when they make a transaction
          within 14 days of the invite. Use $AURA to pay for transaction fees.
        </Text>
        <ReferralCard amount={auraAmount} />
        <Text
          className="font-medium text-lg pb-2"
          style={{ color: theme.textColor }}
        >
          Share your link
        </Text>
        <Input
          placeholder={data?.referralLink || ""}
          readOnly
          style={{ backgroundColor: theme.textColor }}
        />
        <Button
          buttonStyle="w-full rounded-lg my-4"
          style={{
            backgroundColor: data?.referralLink
              ? theme.tabBarActiveTintColor
              : theme.tabBarInactiveTintColor,
          }}
          onPress={handlePress}
        >
          <Text
            className="text-center font-semibold py-4"
            style={{ color: colors.white }}
          >
            {data?.referralLink
              ? "Share"
              : "There was a problem finding your referral link"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

type ReferralCardProps = {
  amount: number;
};

const ReferralCard = ({ amount }: ReferralCardProps) => {
  const { theme } = useTheme();
  return (
    <View
      className="p-6 rounded-3xl my-8"
      style={{ backgroundColor: theme.borderColor }}
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
