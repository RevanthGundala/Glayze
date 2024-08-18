import * as React from "react";
import { PostHogProvider as ExpoPostHogProvider } from "posthog-react-native";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpoPostHogProvider apiKey="phc_5e0XRA3mpS09AodQsC7YqKAtTtU1sPkeM7ldfIatp8q">
      {children}
    </ExpoPostHogProvider>
  );
}
