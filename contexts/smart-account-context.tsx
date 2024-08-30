import React, { createContext, useContext, ReactNode } from "react";
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
  useEmbeddedWallet,
  usePrivy,
  isNotCreated,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";

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

const queryClient = new QueryClient();

const fetchSmartAccountClient = async (
  address: Address,
  provider: PrivyEmbeddedWalletProvider
): Promise<SmartAccountClientType | null> => {
  try {
    if (!address || !provider) {
      throw new Error("No address or provider found.");
    }
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const publicClient = createPublicClient({
      chain,
      transport: http(process.env.EXPO_PUBLIC_RPC_URL as string),
    });

    const walletClient = createWalletClient({
      account: address,
      chain,
      transport: custom(provider),
    });
    const signer = walletClientToSmartAccountSigner(walletClient);
    const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
      signer,
      factoryAddress: process.env.EXPO_PUBLIC_BASE_FACTORY_ADDRESS as Address,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    const cloudPaymaster = createPimlicoPaymasterClient({
      chain,
      transport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY as string),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
      bundlerTransport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY as string),
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
  const wallet = useEmbeddedWallet();
  const { isReady, user } = usePrivy();

  const {
    data: smartAccountClient,
    isLoading,
    error,
    refetch,
  } = useQuery<SmartAccountClientType | null, Error>({
    queryKey: ["smartAccountClient", wallet],
    queryFn: async () => {
      if (!isReady || !user) return null;
      try {
        if (isNotCreated(wallet)) {
          const provider = await wallet.create({ recoveryMethod: "privy" });
          if (!provider) {
            return null;
          }
          setTimeout(() => refetch(), 0); // Force a refetch after wallet creation
          return null;
        }
        const address = wallet.account?.address as Address;
        const provider = await wallet.getProvider();
        return fetchSmartAccountClient(address, provider);
      } catch (error) {
        console.error("Error in smartAccountClient query:", error);
        throw error;
      }
    },
    enabled: isReady,
    retry: 2,
  });

  console.log("SmartAccountProvider render:", {
    clientExists: !!smartAccountClient,
    isLoading,
    hasError: !!error,
    isReady,
  });

  return (
    <SmartAccountContext.Provider
      value={{
        smartAccountClient: smartAccountClient ?? null,
        isLoading,
        error: error ?? null,
        refetch,
      }}
    >
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
