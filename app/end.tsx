import { SafeAreaView, View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useUser } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";

export default function End() {
  const router = useRouter();
  const { theme } = useTheme();
  const { data } = useUser();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="mt-16 space-y-4 items-center">
        <Text className="w-[250px] text-3xl font-semibold text-white text-center">
          You're ready to start trading!
        </Text>
        <View className="items-center py-8 space-y-4">
          <Image
            source={{ uri: data?.db?.profile_pic || "" }}
            className="w-16 h-16"
          />
          <View className="pb-8 space-y-1 items-center">
            <Text className="text-white text-2xl font-semibold">
              {data?.db?.name || ""}
            </Text>
            <Text className="text-white text-lg opacity-80">
              {data?.db?.handle || ""}
            </Text>
          </View>
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center rounded-full w-[300px]"
            }
            onPress={() => router.push("/(authenticated)/home")}
            style={{ backgroundColor: theme.tabBarActiveTintColor }}
          >
            <Text className="text-black text-lg font-medium py-3">
              Start Trading
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
