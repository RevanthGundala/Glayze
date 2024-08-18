import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import { Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/theme-context";
import { client } from "@/utils/dynamic-client.native";
import { SmartAccountProvider } from "@/contexts/smart-account-context";
import { PostHogProvider } from "@/components/posthog";
import { SentryProvider } from "@/components/sentry";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <client.reactNative.WebView />
      <PostHogProvider>
        <SentryProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <SmartAccountProvider>
                <StatusBar />
                {children}
              </SmartAccountProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </SentryProvider>
      </PostHogProvider>
    </>
  );
};

const StatusBar = () => {
  const { themeName } = useTheme();
  if (Platform.OS === "web") {
    return null;
  } else {
    return <ExpoStatusBar style={themeName === "dark" ? "light" : "dark"} />;
  }
};
