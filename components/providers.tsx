import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/theme-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/theme-context";
import { SmartAccountProvider } from "@/contexts/smart-account-context";
import { PostHogProvider } from "@/components/posthog";
// import { SentryProvider } from "@/components/sentry";
import { PrivyProvider } from "@/components/privy";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <PostHogProvider>
        {/* <SentryProvider> */}
        <PrivyProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <SmartAccountProvider>
                <StatusBar />
                {children}
              </SmartAccountProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </PrivyProvider>
        {/* </SentryProvider> */}
      </PostHogProvider>
    </>
  );
};

const StatusBar = () => {
  const { themeName } = useTheme();
  return <ExpoStatusBar style={themeName === "dark" ? "light" : "dark"} />;
};
