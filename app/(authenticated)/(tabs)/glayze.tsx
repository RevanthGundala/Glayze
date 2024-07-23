import { Input } from "@/components/ui/Input";
import { View, Text, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { SwipeButton } from "@/components/ui/SwipeButton";
import { CONTRACT_ADDRESS, abi } from "@/utils/constants";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useRouter } from "expo-router";

export default function Glayze() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  const [deployment, setDeployment] = useState(0);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleSwipe = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "glayze",
      args: [name, symbol, url],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      router.push("/aux/success");
    }
  }, [isConfirmed]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-white font-semibold text-2xl text-center">
          Ready to Glayze?
        </Text>
        <View className="space-y-6 mt-8">
          <View>
            <Text className="text-white text-lg">Name</Text>
            <Input placeholder="ELON" value={name} onChangeText={setName} />
          </View>
          <View>
            <Text className="text-white text-lg">Symbol</Text>
            <Input placeholder="ELON" value={symbol} onChangeText={setSymbol} />
          </View>
          <Text className="text-white text-lg">URL</Text>
          <Input
            placeholder="https://x.com/ElonMusk/123213"
            value={url}
            onChangeText={setUrl}
          />
        </View>
        <PaymentDetails deployment={deployment} fee={fee} total={total} />
        {!isPending && !isConfirming ? (
          <SwipeButton
            primaryColor="bg-primary"
            text="Swipe to Confirm"
            onComplete={handleSwipe}
          />
        ) : (
          <Text>Swipping...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

type PaymentDetailsProps = {
  deployment: number;
  fee: number;
  total: number;
};

const PaymentDetails = ({ deployment, fee, total }: PaymentDetailsProps) => {
  return (
    <View className="mt-8 space-y-4">
      <Text className="text-white text-xl">Payment Details</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-white opacity-70">Deployment</Text>
        <Text className="text-white">${deployment}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-white opacity-70">Fee</Text>
        <Text className="text-white">${fee}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-white opacity-70">Total</Text>
        <Text className="text-white">${total}</Text>
      </View>
    </View>
  );
};
