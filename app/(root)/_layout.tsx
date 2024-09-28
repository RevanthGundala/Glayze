import { Stack } from "expo-router/stack";

export default function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="connect-to-twitter"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="end" options={{ headerShown: false }} />
    </Stack>
  );
}
