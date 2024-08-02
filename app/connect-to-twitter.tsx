import { SafeAreaView, View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BackArrow } from "@/components/ui/back-arrow";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { useLinkWithOAuth } from "@privy-io/expo";

export default function ConnectToTwitter() {
  const router = useRouter();
  const { link, state } = useLinkWithOAuth();

  const handleConnect = async () => {
    console.log("clicked");
    const user = await link({
      provider: "twitter",
      redirectUri: "https://glayze.app/api/twitter/callback",
    });
    console.log("user: ", user);
  };
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
            onPress={handleConnect}
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
