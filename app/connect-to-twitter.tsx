import { SafeAreaView, View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "expo-router";
import { Link } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { Header } from "@/components/header";
import { colors } from "@/utils/theme";
import { upsertUser } from "@/utils/helpers";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { useLinkWithOAuth, usePrivy } from "@privy-io/expo";
import Toast from "react-native-toast-message";
import { GlayzeToast } from "@/components/ui/glayze-toast";

export default function ConnectToTwitter() {
  const router = useRouter();
  const { theme } = useTheme();
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { user } = usePrivy();

  const handleUpsert = async (xUserId: string | null) => {
    try {
      const error = await upsertUser(user?.id, {
        xUserId,
        address,
        referralCode: address,
      });
      console.log(error);
      if (error) throw error;
      router.push("/end");
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error",
        text2: "Please try again",
        type: "error",
      });
    }
  };

  const { link } = useLinkWithOAuth({
    onSuccess(user) {
      const xAccount = user?.linked_accounts?.find(
        (acc) => acc.type === "twitter_oauth"
      );
      if (!xAccount) throw new Error("No X account found");
      handleUpsert(xAccount.subject);
    },
    onError(error) {
      console.log(error);
      Toast.show({
        text1: "Error Connecting to X",
        text2: "Please try again",
        type: "error",
      });
    },
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
      {/* <View className="flex flex-row">
        <Header backArrow />
      </View> */}
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
          When people post your X posts, you are eligible to claim trading fees
        </Text>
        <View className="py-8 space-y-4">
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center rounded-full"
            }
            onPress={() => link({ provider: "twitter" })}
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
          <Button onPress={async () => await handleUpsert(null)}>
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
