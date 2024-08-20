import { Stack } from "expo-router/stack";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { Loading } from "@/components/loading";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const { smartAccountClient, isLoading, refetch, error } = useSmartAccount();

  useEffect(() => {
    if (error) {
      console.error("Error fetching smart account client:", error);
    }
  }, [error]);

  if (!smartAccountClient || isLoading) {
    return <Loading />;
  }

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
