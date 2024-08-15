import { Stack } from "expo-router/stack";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { client } from "@/utils/dynamic-client.native";
import { Href, useRouter } from "expo-router";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const { auth } = useReactiveClient(client);
  const router = useRouter();
  useEffect(() => {
    if (!auth.token) {
      console.log("No token");
      router.replace("/" as Href<string>);
    }
  }, [auth]);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="aux/success" options={{ headerShown: false }} />
      <Stack.Screen name="aux/error" options={{ headerShown: false }} />
      <Stack.Screen name="aux/refer" options={{ headerShown: false }} />
      <Stack.Screen name="aux/profile" options={{ headerShown: false }} />
      <Stack.Screen name="aux/send" options={{ headerShown: false }} />
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
}
