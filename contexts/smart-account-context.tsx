import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
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
  smartAccountClient: SmartAccountClientType | null | undefined;
  isLoading: boolean;
  error: Error | null;
};

const SmartAccountContext = createContext<SmartAccountContextType | undefined>(
  undefined
);

const fetchSmartAccountClient =
  async (): Promise<SmartAccountClientType | null> => {
    try {
      const wallet = await client.wallets.embedded.getWallet();
      if (!wallet) return null;

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
      return null;
    }
  };

export function SmartAccountProvider({ children }: { children: ReactNode }) {
  const {
    data: smartAccountClient,
    isLoading,
    error,
  } = useQuery<SmartAccountClientType | null, Error>({
    queryKey: ["smartAccountClient"],
    queryFn: fetchSmartAccountClient,
  });

  console.log("SmartAccountProvider render:", {
    clientExists: !!smartAccountClient,
    isLoading,
    hasError: !!error,
  });

  return (
    <SmartAccountContext.Provider
      value={{ smartAccountClient, isLoading, error }}
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
