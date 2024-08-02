import { SafeAreaView, View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { useLinkWithOAuth } from "@privy-io/expo";
import { useTheme } from "@/contexts/theme-context";
import { Header } from "@/components/header";

export default function ConnectToTwitter() {
  const router = useRouter();
  const { link, state } = useLinkWithOAuth();
  const { theme } = useTheme();

  const handleConnect = async () => {
    console.log("clicked");
    const user = await link({
      provider: "twitter",
      redirectUri: "https://glayze.app/api/twitter/callback",
    });
    console.log("user: ", user);
  };
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="mt-24 space-y-4 items-center">
        <Text
          className="text-3xl font-semibold"
          style={{ color: theme.textColor }}
        >
          Earn Rewards
        </Text>
        <Text
          className="w-[300px] text-center text-lg"
          style={{ color: theme.mutedForegroundColor }}
        >
          When people post your tweets, you are eligible to claim trading fees
        </Text>
        <View className="py-8 space-y-4">
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center rounded-full"
            }
            onPress={handleConnect}
            style={{
              backgroundColor: theme.tabBarActiveTintColor,
              borderColor: theme.tabBarActiveTintColor,
            }}
          >
            <Text
              className="text-black text-lg font-medium px-8 py-3"
              style={{ color: theme.textColor }}
            >
              Connect to X
            </Text>
          </Button>
          <Link href="/end" asChild>
            <Text
              className="text-center text-lg pt-4"
              style={{ color: theme.mutedForegroundColor }}
            >
              I'll do this later
            </Text>
          </Link>
        </View>
      </View>
      <ProgressBar sections={3} currentSection={2} />
    </SafeAreaView>
  );
}
