import { SafeAreaView, View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { useLinkWithOAuth } from "@privy-io/expo";

export default function Connect() {
  const router = useRouter();
  const { link } = useLinkWithOAuth();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />
      <View className="mt-24 space-y-4 items-center">
        <Text className="text-3xl font-semibold text-white">Earn Rewards</Text>
        <Text className="w-[300px] text-center text-lg text-white opacity-40">
          When people post your tweets, you are eligible to claim trading fees
        </Text>
        <View className="py-8 space-y-4">
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center bg-primary rounded-full"
            }
            onPress={() => link({ provider: "twitter", redirectUri: "/login" })}
          >
            <Text className="text-black text-lg font-medium px-8 py-3">
              Connect to X
            </Text>
          </Button>
          <Link href="/end" asChild>
            <Text className="text-white text-center text-lg opacity-40">
              I'll do this later
            </Text>
          </Link>
        </View>
      </View>
      <ProgressBar sections={3} currentSection={2} />
    </SafeAreaView>
  );
}
