import "fast-text-encoding";
import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import "expo-router/entry";

const environmentId =
  process.env.EXPO_PUBLIC_ENVIRONMENT_ID ||
  "850b02af-863c-4826-baaf-6e77b56b0dbd";

if (!environmentId) {
  throw new Error("EXPO_PUBLIC_ENVIRONMENT_ID is required");
}

console.log("Environment ID:", environmentId);
// Leave this undefined to use the default dynamic api base url

export const client = createClient({
  environmentId,
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "Dynamic Demo",
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension());
