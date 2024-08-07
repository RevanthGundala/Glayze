import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Providers } from "@/components/providers";
import { NativeWindStyleSheet } from "nativewind";
import { Platform, StatusBar } from "react-native";
import { View, Image, Text } from "react-native";
import appleIcon from "@/assets/images/socials/apple.png";
import icon from "@/assets/images/icon.png";
import { lightTheme as theme } from "@/utils/theme";
import { Button } from "@/components/ui/button";
import { client } from "@/entrypoint";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  console.log("Entering Layout component");
  try {
    const router = useRouter();
    if (Platform.OS === "web") {
      console.log("Only available on iOS!");
      return (
        <View className="flex-1 bg-black">
          <View className="mt-40">
            <Image source={icon} className="w-1/2 h-1/2" />
          </View>
          <View className="flex items-center justify-center mt-20">
            <Button
              className="w-1/2 rounded-full py-3 border border-gray-200 flex-row items-center justify-center"
              style={{
                backgroundColor: theme.secondaryTextColor,
              }}
              onPress={() => router.push("/")}
            >
              <Image source={appleIcon} className="w-4 h-4 mr-3" />
              <Text className="text-center" style={{ color: theme.textColor }}>
                Download on the App store
              </Text>
            </Button>
          </View>
        </View>
      );
    }
    console.log("Rendering Layout for non-web platform");
    return <InitialLayout />;
  } catch (error) {
    console.error("Error rendering Layout:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An error occurred. Please check the console for details.</Text>
      </View>
    );
  }
}

const InitialLayout = () => {
  const router = useRouter();

  useEffect(() => {
    // console.log("initial layout");
    router.replace("/home");
    // if (!isReady) return;
    // if (isConnected(wallet)) {
    //   router.replace("/home");
    // }
  }, []);

  return (
    <Stack>
      {/* <Stack.Screen name="(root)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="aux/success" options={{ headerShown: false }} />
      <Stack.Screen name="aux/error" options={{ headerShown: false }} />
      <Stack.Screen name="aux/refer" options={{ headerShown: false }} />
      <Stack.Screen name="aux/profile" options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="aux/send"
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen name="aux/receive" options={{ headerShown: false }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="post/sell" options={{ headerShown: false }} />
      <Stack.Screen name="post/buy" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/my-account"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile/appearance"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile/privacy-and-legal"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};
