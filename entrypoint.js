import "fast-text-encoding";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import { polyfillWebCrypto } from "expo-standard-web-crypto";
import { randomUUID } from "expo-crypto";

polyfillWebCrypto();
crypto.randomUUID = randomUUID;

// const environmentId =
//   process.env.EXPO_PUBLIC_ENVIRONMENT_ID ||
//   "850b02af-863c-4826-baaf-6e77b56b0dbd";

// if (!environmentId) {
//   throw new Error("EXPO_PUBLIC_ENVIRONMENT_ID is required");
// }

// console.log("Environment ID:", environmentId);

// Use these imports conditionally
// if (
//   Platform.OS !== "web" &&
//   dynamicClient &&
//   ReactNativeExtension &&
//   ViemExtension
// ) {
//   const client = dynamicClient({
//     environmentId,
//     appLogoUrl: require("./assets/images/icon.png"),
//     appName: "Glayze",
//   })
//     .extend(ReactNativeExtension())
//     .extend(ViemExtension());
// }

import "expo-router/entry";
