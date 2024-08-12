import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";

const environmentId = process.env.EXPO_PUBLIC_ENVIRONMENT_ID;

if (!environmentId) {
  throw new Error("EXPO_PUBLIC_ENVIRONMENT_ID is required");
}

export const client = createClient({
  environmentId,
  appLogoUrl: require("@/assets/images/icon.png"),
  appName: "Glayze",
})
  .extend(
    ReactNativeExtension({
      appOrigin: "https://glayze.app",
    })
  )
  .extend(ViemExtension());
