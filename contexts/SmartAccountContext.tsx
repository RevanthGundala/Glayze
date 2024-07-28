import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { useEmbeddedWallet, isNotCreated, isConnected } from "@privy-io/expo";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

interface SmartAccountContextType {
  smartAccount: BiconomySmartAccountV2 | null;
  isLoading: boolean;
  error: Error | null;
}

const SmartAccountContext = createContext<SmartAccountContextType | undefined>(
  undefined
);

export const SmartAccountProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const wallet = useEmbeddedWallet();

  useEffect(() => {
    const initializeSmartAccount = async () => {
      try {
        if (!isNotCreated) {
          await wallet.create({
            recoveryMethod: "privy",
          });
        } else if (!isConnected(wallet)) {
          throw new Error("Wallet not connected");
        }

        const provider = await wallet.getProvider();

        const walletClient = createWalletClient({
          chain: baseSepolia,
          transport: custom(provider),
        });

        const smartAccountInstance = await createSmartAccountClient({
          signer: walletClient,
          bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL!,
          biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_API_KEY!,
        });

        setSmartAccount(smartAccountInstance);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeSmartAccount();
  }, [wallet]);

  return (
    <SmartAccountContext.Provider value={{ smartAccount, isLoading, error }}>
      {children}
    </SmartAccountContext.Provider>
  );
};

export const useSmartAccount = () => {
  const context = useContext(SmartAccountContext);
  if (context === undefined) {
    throw new Error(
      "useSmartAccount must be used within a SmartAccountProvider"
    );
  }
  return context;
};
