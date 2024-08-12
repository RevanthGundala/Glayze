import { SafeAreaView, View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/theme-context";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Header } from "@/components/header";

export default function End() {
  const router = useRouter();
  const { theme } = useTheme();
  const { auth } = useReactiveClient(client);
  const name =
    auth.authenticatedUser?.verifiedCredentials?.[2]?.oauthDisplayName ??
    "Anon";
  const handle =
    auth.authenticatedUser?.verifiedCredentials?.[2]?.oauthUsername ?? "Anon";
  const image =
    auth.authenticatedUser?.verifiedCredentials?.[2]?.oauthAccountPhotos?.[0];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="space-y-4 items-center">
        <Text className="w-[250px] text-2xl font-semibold text-black text-center">
          You're ready to start trading {name}!
        </Text>
        <View className="items-center py-8 space-y-4">
          {image ? (
            <Image source={{ uri: image }} className="w-20 h-20 rounded-full" />
          ) : (
            <Image
              source={require("@/assets/images/aux/profile.png")}
              className="w-20 h-20"
              style={{ opacity: 0.8, tintColor: theme.mutedForegroundColor }}
            />
          )}
          <View className="pb-8 items-center">
            <Text
              style={{ color: theme.textColor }}
              className="text-xl font-semibold"
            >
              {name}
            </Text>
            <Text
              style={{ color: theme.mutedForegroundColor }}
              className="text-lg"
            >
              @{handle}
            </Text>
          </View>
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center rounded-full w-[300px]"
            }
            onPress={() => router.replace("/(authenticated)/(tabs)/home")}
            style={{ backgroundColor: theme.tabBarActiveTintColor }}
          >
            <Text className="text-white text-lg font-medium py-3">
              Start Trading
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
