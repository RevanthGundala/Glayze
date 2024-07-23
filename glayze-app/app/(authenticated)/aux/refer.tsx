import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Input } from "@/components/ui/Input";
import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";

export default function Refer() {
  const [glayzeAmount, setGlayzeAmount] = useState(20); // TODO: Fetch from API
  const [link, setLink] = useState("https://glaze.fun/invite/123"); // TODO: Fetch from API

  const handlePress = () => {
    // TODO: Implement referral functionality
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />
      <View className="flex items-center">
        <Text className="text-white font-semibold text-2xl">
          Refer your friends.
        </Text>
        <Text className="text-white font-semibold text-2xl">Earn $GLAYZE.</Text>
      </View>
      <View className="flex-col space-y-4 p-6">
        <Text className="text-white opacity-70 leading-6">
          You and your friend both earn 5 $GLAYZE when they make a transaction
          within 14 days of the invite. Use $GLAYZE to pay for transaction fees.
        </Text>
        <ReferralCard amount={glayzeAmount} />
        <Text className="text-white font-medium text-lg pb-2">
          Share your link
        </Text>
        <Input placeholder={link} readOnly />
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
      <Text className="text-gray-400 text-xl mb-3">Total Amount Earned</Text>
      <Text className="text-white text-3xl font-bold">{amount} $GLAYZE</Text>
    </View>
  );
};
