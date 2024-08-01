import React from "react";
import { PostHogProvider } from "posthog-react-native";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SmartAccountProvider } from "../contexts/SmartAccountContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { PrivyProvider } from "@/utils/privy";
import { Platform } from "react-native";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: "https://us.i.posthog.com",
      }}
    >
      <ThemeProvider>
        {/* <StatusBarConfig /> */}
        <PrivyWrapper>
          <QueryClientProvider client={queryClient}>
            <SmartAccountProvider>{children}</SmartAccountProvider>
          </QueryClientProvider>
        </PrivyWrapper>
      </ThemeProvider>
    </PostHogProvider>
  );
};

const PrivyWrapper = ({ children }: { children: React.ReactNode }) => {
  // TODO:
  if (Platform.OS === "web") {
    return <>{children}</>;
  } else {
    return (
      <PrivyProvider appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID}>
        {children}
      </PrivyProvider>
    );
  }
};

const StatusBarConfig = () => {
  const { theme, themeName } = useTheme();

  return <StatusBar />;
};
