import { PrivyProvider as ReactPrivyProvider } from "@privy-io/react-auth";
import { baseSepolia, base } from "viem/chains";

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
  return (
    <ReactPrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        supportedChains: [chain],
      }}
    >
      {children}
    </ReactPrivyProvider>
  );
};
