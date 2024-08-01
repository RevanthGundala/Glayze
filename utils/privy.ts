import { Platform } from "react-native";

let privyModule: any = null;
let PrivyProvider: any = null;
let usePrivy: any = null;
// Add other Privy exports you need

if (Platform.OS === "web") {
  // TODO:
  // privyModule = require("@privy-io/react-auth");
  // Assign other exports
} else {
  privyModule = require("@privy-io/expo");
}

PrivyProvider = privyModule.PrivyProvider;
usePrivy = privyModule.usePrivy;

export { PrivyProvider, usePrivy };
