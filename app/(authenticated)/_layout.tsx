import { Loading } from "@/components/loading";
import { usePrivy } from "@privy-io/expo";
import { Stack } from "expo-router/stack";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const { isReady } = usePrivy();
  if (!isReady) return <Loading />;
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="aux/success" options={{ headerShown: false }} />
      <Stack.Screen name="aux/error" options={{ headerShown: false }} />
      <Stack.Screen name="aux/refer" options={{ headerShown: false }} />
      <Stack.Screen name="aux/profile" options={{ headerShown: false }} />
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
}
