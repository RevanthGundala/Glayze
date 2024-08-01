import "@walletconnect/react-native-compat";
import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { defaultWagmiConfig } from "@web3modal/wagmi-react-native";
import { sepolia, base, baseSepolia } from "wagmi/chains";
import {
  PrivyProvider,
  usePrivy,
  isConnected,
  useEmbeddedWallet,
} from "@privy-io/expo";
import { SmartAccountProvider } from "../contexts/SmartAccountContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Providers } from "@/components/providers";

// const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_ID!;

// // TODO: Update metadata
// const metadata = {
//   name: "AppKit RN",
//   description: "AppKit RN Example",
//   url: "https://walletconnect.com",
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
//   redirect: {
//     native: "YOUR_APP_SCHEME://",
//     universal: "YOUR_APP_UNIVERSAL_LINK.com",
//   },
// };

// const chains = [sepolia, base] as const;

// const config = defaultWagmiConfig({
//   projectId,
//   metadata,
//   chains,
// });

export default function Layout() {
  return (
    <Providers>
      <InitialLayout />
    </Providers>
  );
}

const InitialLayout = () => {
  const { isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  const router = useRouter();
  useEffect(() => {
    router.replace("/(authenticated)/home");
    // if (!isReady) return;
    // if (isConnected(wallet)) {
    //   router.replace("/(authenticated)/home");
    // }
  }, [isReady, wallet]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
        name="(authenticated)/aux/wallet"
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
