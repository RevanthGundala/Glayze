import { Stack } from "expo-router/stack";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect, useCallback } from "react";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { client } from "@/utils/dynamic-client.native";
import { Href, useRouter } from "expo-router";
import { useSmartAccount } from "@/contexts/smart-account-context";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const { auth } = useReactiveClient(client);
  const { smartAccountClient, isLoading, refetch, error } = useSmartAccount();
  const router = useRouter();

  const handleRefetch = useCallback(() => {
    console.log("Refetching smart account client...");
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!auth.token) {
      console.log("No token, redirecting to home");
      router.replace("/" as Href<string>);
    }
  }, [auth, router]);

  useEffect(() => {
    if (!smartAccountClient && !isLoading) {
      console.log("Smart account client not available, refetching");
      handleRefetch();
    }
  }, [smartAccountClient, isLoading, handleRefetch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching smart account client:", error);
    }
  }, [error]);

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
