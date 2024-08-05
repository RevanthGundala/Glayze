import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Providers } from "@/components/providers";
import { NativeWindStyleSheet } from "nativewind";
import { Platform } from "react-native";
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
    return (
      <>
        <client.reactNative.WebView />
        <Providers>
          <InitialLayout />
        </Providers>
      </>
    );
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
    // router.replace("/(authenticated)/home");
    // if (!isReady) return;
    // if (isConnected(wallet)) {
    //   router.replace("/(authenticated)/home");
    // }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-email" options={{ headerShown: false }} />
      <Stack.Screen
        name="connect-to-twitter"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="end" options={{ headerShown: false }} />
      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/aux/success"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/aux/refer"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/aux/profile"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/aux/send"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/aux/receive"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/post/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/post/sell"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/post/buy"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/profile/my-account"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/profile/appearance"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};
