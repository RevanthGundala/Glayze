import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import { PostHogProvider } from "@/utils/posthog";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { useEffect } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  // useEffect(() => {
  //   Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  //   Purchases.configure({
  //     apiKey: process.env.EXPO_PUBLIC_PURCHASES_APPLE_API_KEY!,
  //     appUserID: null,
  //     useAmazon: false,
  //   });
  // }, []);
  return (
    <>
      <ThemeProvider>
        {/* <PlatformWrapper> */}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        {/* </PlatformWrapper> */}
      </ThemeProvider>
    </>
  );
};

const PlatformWrapper = ({ children }: { children: React.ReactNode }) => {
  // TODO:
  if (Platform.OS === "web") {
    return <>{children}</>;
  } else {
    return (
      <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
        options={{
          host: "https://us.i.posthog.com",
        }}
      >
        {children}
      </PostHogProvider>
    );
  }
};
