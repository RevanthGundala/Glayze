import * as React from "react";
import { PostHogProvider as ExpoPostHogProvider } from "posthog-react-native";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpoPostHogProvider apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}>
      {children}
    </ExpoPostHogProvider>
  );
}
