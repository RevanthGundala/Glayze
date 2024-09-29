import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SmartAccountClient } from "permissionless";
import {
  http,
  Address,
  createPublicClient,
  createWalletClient,
  custom,
} from "viem";
import { baseSepolia, base } from "viem/chains";
import type { Chain, Transport } from "viem";
import {
  usePrivy,
  useWallets,
  getEmbeddedConnectedWallet,
  EIP1193Provider,
} from "@privy-io/react-auth";
import { toSimpleSmartAccount } from "permissionless/accounts";
import {
  entryPoint06Address,
  entryPoint07Address,
} from "viem/account-abstraction";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createSmartAccountClient } from "permissionless";

type SmartAccountContextType = {
  smartAccountClient: SmartAccountClient | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const SmartAccountContext = createContext<SmartAccountContextType | undefined>(
  undefined
);

const fetchSmartAccountClient = async (
  address: Address,
  provider: EIP1193Provider
): Promise<SmartAccountClient | null> => {
  try {
    if (!address || !provider) {
      throw new Error("No address or provider found.");
    }

    const chain: Chain =
      process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const publicClient = createPublicClient({
      chain,
      transport: http(process.env.EXPO_PUBLIC_RPC_URL),
    });

    const walletClient = createWalletClient({
      account: address,
      chain,
      transport: custom(provider),
    });
    const simpleSmartAccount = await toSimpleSmartAccount({
      owner: walletClient,
      client: publicClient,
      entryPoint: {
        address: entryPoint06Address,
        version: "0.6",
      },
    });
    const cloudPaymaster = createPimlicoClient({
      transport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY),
      entryPoint: {
        address: entryPoint06Address,
        version: "0.6",
      },
    });
    const smartAccountClient = createSmartAccountClient({
      account: simpleSmartAccount,
      chain,
      bundlerTransport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY),
      paymaster: cloudPaymaster,
    });
    return smartAccountClient as SmartAccountClient;
  } catch (error) {
    console.error("Error in fetchSmartAccountClient:", error);
    throw error;
  }
};

export function SmartAccountProvider({ children }: { children: ReactNode }) {
  const { wallets, ready: walletReady } = useWallets();
  const { ready, user, createWallet } = usePrivy();
  const wallet = getEmbeddedConnectedWallet(wallets);

  const {
    data: smartAccountClient,
    isLoading,
    error,
    refetch,
  } = useQuery<SmartAccountClient | null, Error>({
    queryKey: ["smartAccountClient", wallet?.address],
    queryFn: async () => {
      console.log("Wallet: ", wallet);
      if (!ready || !user || !wallet || !walletReady) return null;
      try {
        const address = wallet.address as Address;
        const provider = await wallet.getEthereumProvider();
        return fetchSmartAccountClient(address, provider);
      } catch (error) {
        console.error("Error in smartAccountClient query:", error);
        throw error;
      }
    },
    enabled: ready && walletReady && !!wallet?.address,
    retry: 2,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("SmartAccountProvider render:", {
      clientExists: !!smartAccountClient,
      isLoading,
      hasError: !!error,
      ready,
    });
  }

  const contextValue = useMemo(
    () => ({
      smartAccountClient: smartAccountClient ?? null,
      isLoading,
      error: error ?? null,
      refetch,
    }),
    [smartAccountClient, isLoading, error, refetch]
  );

  return (
    <SmartAccountContext.Provider value={contextValue}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccount() {
  const context = useContext(SmartAccountContext);
  if (context === undefined) {
    throw new Error(
      "useSmartAccount must be used within a SmartAccountProvider"
    );
  }
  return context;
}
