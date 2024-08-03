import { useState, useEffect } from "react";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { useEmbeddedWallet, isNotCreated, isConnected } from "@privy-io/expo";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

export const useSmartAccount = () => {
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const wallet = useEmbeddedWallet();

  useEffect(() => {
    const initializeSmartAccount = async () => {
      let provider = null;
      try {
        if (!isNotCreated) {
          provider = await wallet.create({
            recoveryMethod: "privy",
          });
        } else if (!isConnected(wallet)) {
          throw new Error("Wallet not connected");
        } else {
          provider = await wallet.getProvider();
        }
        if (!provider) {
          throw new Error("Provider not found");
        }
        const walletClient = createWalletClient({
          chain: baseSepolia,
          transport: custom(provider),
        });

        const smartAccountInstance = await createSmartAccountClient({
          signer: walletClient,
          bundlerUrl: process.env.EXPO_PUBLIC_BUNDLER_URL!,
          biconomyPaymasterApiKey: process.env.EXPO_PUBLIC_PAYMASTER_API_KEY!,
        });

        console.log(
          "Smart account address: ",
          await smartAccountInstance.getAccountAddress()
        );
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

  return { smartAccount, isLoading, error };
};
