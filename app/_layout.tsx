import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { PostHogProvider } from "posthog-react-native";

export default function Layout() {
  return (
    <PostHogProvider
      apiKey="phc_xKZtsLn1p5MICA2mx5LxNm1v0BND5WvFu5hHrL3r0L7"
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <InitialLayout />
    </PostHogProvider>
  );
}

const InitialLayout = () => {
  const isSignedIn = true; // TODO:
  const router = useRouter();
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(authenticated)/home");
    }
  }, [isSignedIn]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="connect" options={{ headerShown: false }} />
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
        name="(authenticated)/aux/wallet"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/item/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/item/sell"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/item/buy"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/profile/my-account"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/profile/contact-support"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/profile/privacy-and-security"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};
