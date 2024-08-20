import { PrivyProvider as ExpoPrivyProvider } from "@privy-io/expo";

export const PrivyProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExpoPrivyProvider
      appId="clymf4i5m06qx8skwtkh8emh2"
      clientId="client-WY2o7dkwZC3XMPwz7NiCgEgvqeNbMEdsXPcqT2pjJipkZ"
    >
      {children}
    </ExpoPrivyProvider>
  );
};
