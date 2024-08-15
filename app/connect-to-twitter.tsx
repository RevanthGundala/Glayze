import { SafeAreaView, View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "expo-router";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { Header } from "@/components/header";
import { colors } from "@/utils/theme";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Loading } from "@/components/loading";
import { upsertUser } from "@/utils/helpers";
import { useSmartAccount } from "@/contexts/smart-account-context";

export default function ConnectToTwitter() {
  const router = useRouter();
  const { theme } = useTheme();
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { sdk, auth } = useReactiveClient(client);
  const pathname = usePathname();

  if (!sdk.loaded) return <Loading />;

  const completeUserFlow = async () => {
    try {
      const xUserId = auth.authenticatedUser?.verifiedCredentials?.[2]?.id
        ? parseInt(auth.authenticatedUser?.verifiedCredentials?.[2]?.id)
        : null;
      await upsertUser(auth.authenticatedUser?.userId, {
        xUserId,
        address,
        referralCode: "test",
      });
      router.push("/end");
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnect = async () => {
    try {
      await auth.social.connect({
        provider: "twitter",
        redirectPathname: pathname,
      });
      await completeUserFlow();
    } catch (error) {
      console.log(error);
    }
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
              className="text-lg font-medium px-8 py-3"
              style={{ color: colors.white }}
            >
              Connect to X
            </Text>
          </Button>
          <Button onPress={completeUserFlow}>
            <Text
              className="text-center text-lg pt-4"
              style={{ color: theme.mutedForegroundColor }}
            >
              I'll do this later
            </Text>
          </Button>
        </View>
      </View>
      <ProgressBar sections={3} currentSection={2} />
    </SafeAreaView>
  );
}
