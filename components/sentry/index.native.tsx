import * as Sentry from "@sentry/react-native";
import { ErrorBoundary } from "@sentry/react-native";
import { usePostHog } from "posthog-react-native";

export function SentryProvider({ children }: { children: React.ReactNode }) {
  Sentry.init({
    dsn: "https://af160e085b436e19389700973c316969@o4507799692705792.ingest.us.sentry.io/4507799692902400",
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // enableSpotlight: __DEV__,
  });
  const posthog = usePostHog();
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
