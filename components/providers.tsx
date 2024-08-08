import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import { PostHogProvider as ExpoPostHogProvider } from "@/utils/posthog";
import { Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Purchases from "react-native-purchases";
import { useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_PURCHASES_APPLE_API_KEY!,
      appUserID: null,
      useAmazon: false,
    });
  }, []);
  return (
    <PostHogProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
};

const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO:
  if (Platform.OS === "web") {
    return <>{children}</>;
  } else {
    return (
      <ExpoPostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
        options={{
          host: "https://us.i.posthog.com",
        }}
      >
        {children}
      </ExpoPostHogProvider>
    );
  }
};

const StatusBar = () => {
  const { themeName } = useTheme();
  if (Platform.OS === "web") {
    return null;
  } else {
    return <ExpoStatusBar style={themeName === "dark" ? "light" : "dark"} />;
  }
};
