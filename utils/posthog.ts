import { Platform } from "react-native";

let posthogModule: any = null;
let PostHogProvider: any = null;
// Add other Privy exports you need

if (Platform.OS === "web") {
  // TODO:
  posthogModule = {
    PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  };
} else {
  posthogModule = require("posthog-react-native");
}

PostHogProvider = posthogModule.PostHogProvider;

export { PostHogProvider };
