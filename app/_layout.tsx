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

const queryClient = new QueryClient();

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
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <PrivyProvider appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}>
        {/* <WagmiProvider config={config}> */}
        <QueryClientProvider client={queryClient}>
          <SmartAccountProvider>
            <InitialLayout />
          </SmartAccountProvider>
        </QueryClientProvider>
      </PrivyProvider>
      {/* </WagmiProvider> */}
    </PostHogProvider>
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
        name="(authenticated)/profile/privacy-and-security"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};
