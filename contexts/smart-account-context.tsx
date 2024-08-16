import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
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
import { http, Address, createPublicClient } from "viem";
import { baseSepolia, base } from "viem/chains";
import { client } from "@/utils/dynamic-client.native";
import type { Chain, Transport } from "viem";

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

const fetchSmartAccountClient =
  async (): Promise<SmartAccountClientType | null> => {
    try {
      const wallet = await client.wallets.embedded.getWallet();
      if (!wallet) throw new Error("No wallet found.");

      const chain =
        process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
      const publicClient = createPublicClient({
        chain,
        transport: http(process.env.EXPO_PUBLIC_RPC_URL as string),
      });
      const walletViemClient = client.viem.createWalletClient({
        wallet,
      });
      const signer = walletClientToSmartAccountSigner(walletViemClient);
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
      console.log("🔍 Smart account client created successfully!");
      return smartAccountClient as SmartAccountClientType;
    } catch (error) {
      console.error("Error in fetchSmartAccountClient:", error);
      throw error;
    }
  };

export function SmartAccountProvider({ children }: { children: ReactNode }) {
  const [smartAccountClient, setSmartAccountClient] =
    useState<SmartAccountClientType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClient = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const client = await fetchSmartAccountClient();
      setSmartAccountClient(client);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const refetch = useCallback(() => {
    fetchClient();
  }, [fetchClient]);

  console.log("SmartAccountProvider render:", {
    clientExists: !!smartAccountClient,
    isLoading,
    hasError: !!error,
  });

  return (
    <SmartAccountContext.Provider
      value={{ smartAccountClient, isLoading, error, refetch }}
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
