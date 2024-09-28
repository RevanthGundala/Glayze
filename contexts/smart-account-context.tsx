import React, { createContext, useContext, ReactNode, useMemo } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createSmartAccountClient,
  ENTRYPOINT_ADDRESS_V06,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  signerToSimpleSmartAccount,
  SmartAccount,
} from "permissionless/accounts";
import { EntryPoint } from "permissionless/_types/types";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { SmartAccountClient } from "permissionless";
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

type SmartAccountClientType = SmartAccountClient<
  EntryPoint,
  Transport,
  Chain,
  SmartAccount<EntryPoint, string, Transport, Chain>
>;

type SmartAccountContextType = {
  smartAccountClient: SmartAccountClientType | null;
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
): Promise<SmartAccountClientType | null> => {
  try {
    if (!address || !provider) {
      throw new Error("No address or provider found.");
    }

    const {
      EXPO_PUBLIC_CHAIN,
      EXPO_PUBLIC_RPC_URL,
      EXPO_PUBLIC_BASE_FACTORY_ADDRESS,
      EXPO_PUBLIC_PAYMASTER_KEY,
    } = process.env;

    if (
      !EXPO_PUBLIC_CHAIN ||
      !EXPO_PUBLIC_RPC_URL ||
      !EXPO_PUBLIC_BASE_FACTORY_ADDRESS ||
      !EXPO_PUBLIC_PAYMASTER_KEY
    ) {
      throw new Error("Missing one or more required environment variables.");
    }

    const chain = EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const publicClient = createPublicClient({
      chain,
      transport: http(EXPO_PUBLIC_RPC_URL),
    });

    const walletClient = createWalletClient({
      account: address,
      chain,
      transport: custom(provider),
    });
    const signer = walletClientToSmartAccountSigner(walletClient);
    const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
      signer,
      factoryAddress: EXPO_PUBLIC_BASE_FACTORY_ADDRESS as Address,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    const cloudPaymaster = createPimlicoPaymasterClient({
      chain,
      transport: http(EXPO_PUBLIC_PAYMASTER_KEY),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
      bundlerTransport: http(EXPO_PUBLIC_PAYMASTER_KEY),
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    });
    return smartAccountClient as SmartAccountClientType;
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
  } = useQuery<SmartAccountClientType | null, Error>({
    queryKey: ["smartAccountClient", wallet?.address],
    queryFn: async () => {
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
