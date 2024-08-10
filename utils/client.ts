import { Platform } from "react-native";

let client;

if (Platform.OS !== "web") {
  const { createClient } = require("@dynamic-labs/client");
  const {
    ReactNativeExtension,
  } = require("@dynamic-labs/react-native-extension");
  const { ViemExtension } = require("@dynamic-labs/viem-extension");

  const environmentId =
    process.env.EXPO_PUBLIC_ENVIRONMENT_ID ||
    "850b02af-863c-4826-baaf-6e77b56b0dbd";

  if (!environmentId) {
    throw new Error("EXPO_PUBLIC_ENVIRONMENT_ID is required");
  }

  client = createClient({
    environmentId,
    appLogoUrl: "",
    appName: "",
  })
    .extend(ReactNativeExtension())
    .extend(ViemExtension());
} else {
  client = null;
}

export { client };
