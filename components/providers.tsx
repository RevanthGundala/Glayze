import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { PrivyProvider } from "@/utils/privy";
import { PostHogProvider } from "@/utils/posthog";
import { Platform } from "react-native";
import { UserProvider } from "@/contexts/user-context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider>
      <ExpoWrapper>
        <QueryClientProvider client={queryClient}>
          <UserProvider>{children}</UserProvider>
        </QueryClientProvider>
      </ExpoWrapper>
    </ThemeProvider>
  );
};

const ExpoWrapper = ({ children }: { children: React.ReactNode }) => {
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
        <PrivyProvider
          appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID}
          clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID}
        >
          {children}
        </PrivyProvider>
      </PostHogProvider>
    );
  }
};
