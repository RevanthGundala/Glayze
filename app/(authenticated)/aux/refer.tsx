import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/input";
import { BackArrow } from "@/components/ui/back-arrow";
import { Button } from "@/components/ui/button";
import { useReferral } from "@/hooks";
import { share } from "@/actions/share";

export default function Refer() {
  const [auraAmount, setAuraAmount] = useState(20); // TODO: Fetch from API
  const address = "0x1234567890"; // TODO: Fetch from API
  const { data } = useReferral(address);

  const handlePress = async () => {
    // TODO: Implement referral functionality
    await share(data?.referralLink || null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />
      <View className="flex items-center">
        <Text className="text-white font-semibold text-2xl">
          Refer your friends.
        </Text>
        <Text className="text-white font-semibold text-2xl">Earn $AURA.</Text>
      </View>
      <View className="flex-col space-y-4 p-6">
        <Text className="text-white opacity-70 leading-6">
          You and your friend both earn 5 $AURA when they make a transaction
          within 14 days of the invite. Use $AURA to pay for transaction fees.
        </Text>
        <ReferralCard amount={auraAmount} />
        <Text className="text-white font-medium text-lg pb-2">
          Share your link
        </Text>
        <Input placeholder={data?.referralLink || ""} readOnly />
        <Button
          buttonStyle="bg-primary w-full rounded-lg my-4"
          onPress={handlePress}
        >
          <Text className="text-black text-center font-semibold py-4">
            Share
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
  return (
    <View className="bg-neutral p-6 rounded-3xl my-8">
      <Text className="text-gray-400 text-xl mb-3">Current Balance</Text>
      <Text className="text-white text-3xl font-bold">{amount} $AURA</Text>
    </View>
  );
};
