import { Platform } from "react-native";
import {
  PrivyProvider as ExpoPrivyProvider,
  usePrivy as ExpoUsePrivy,
} from "@privy-io/expo";

let privyModule: any = null;
let PrivyProvider: any = null;
let usePrivy: any = null;
// Add other Privy exports you need

if (Platform.OS === "web") {
  // TODO:
  // privyModule = require("@privy-io/react-auth");
  privyModule = {
    PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
    usePrivy: () => ({}),
  };
  PrivyProvider = privyModule.PrivyProvider;
  usePrivy = privyModule.usePrivy;
} else {
  //   console.log("Using Privy Mobile");
  //   privyModule = require("@privy-io/expo");
  PrivyProvider = ExpoPrivyProvider;
  usePrivy = ExpoUsePrivy;
}

// PrivyProvider = privyModule.PrivyProvider;
// usePrivy = privyModule.usePrivy;

export { PrivyProvider, usePrivy };
