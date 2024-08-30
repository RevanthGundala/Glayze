import { PrivyProvider as ExpoPrivyProvider } from "@privy-io/expo";
import { baseSepolia, base } from "viem/chains";

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
  return (
    <ExpoPrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
      clientId="client-WY2o7dkwZC3XMPwz7NiCgEgvqeNbMEdsXPcqT2pjJipkZ"
      supportedChains={[chain]}
    >
      {children}
    </ExpoPrivyProvider>
  );
};
