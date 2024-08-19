import * as Sentry from "@sentry/react-native";
import { ErrorBoundary } from "@sentry/react-native";
import { usePostHog } from "posthog-react-native";
import { useNavigationContainerRef } from "expo-router";
import { isRunningInExpoGo } from "expo";
import { useEffect } from "react";

export function SentryProvider({ children }: { children: React.ReactNode }) {
  const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
  Sentry.init({
    dsn: "https://af160e085b436e19389700973c316969@o4507799692705792.ingest.us.sentry.io/4507799692902400",
    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used as `routingInstrumentation`
        routingInstrumentation,
        enableNativeFramesTracking: !isRunningInExpoGo(),
        // ...
      }),
    ],
  });

  const posthog = usePostHog();
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => {
        posthog.capture("error", {
          message: error.message,
          stack: componentStack,
        });
        Sentry.captureException(error, { extra: { componentStack } });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
