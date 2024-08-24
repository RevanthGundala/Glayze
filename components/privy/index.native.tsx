import { PrivyProvider as ExpoPrivyProvider } from "@privy-io/expo";
import { baseSepolia, base } from "viem/chains";

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
  return (
    <ExpoPrivyProvider
      appId="clymf4i5m06qx8skwtkh8emh2"
      clientId="client-WY2o7dkwZC3XMPwz7NiCgEgvqeNbMEdsXPcqT2pjJipkZ"
      supportedChains={[chain]}
    >
      {children}
    </ExpoPrivyProvider>
  );
};
