import { useQuery } from "@tanstack/react-query";
import {
  createSmartAccountClient,
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

const fetchSmartAccountClient =
  async (): Promise<SmartAccountClientType | null> => {
    try {
      const wallet = await client.wallets.embedded.getWallet();
      if (!wallet) return null;
      const chain =
        process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
      console.log("🔍 Wallet created!");

      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });
      const walletViemClient = client.viem.createWalletClient({
        wallet,
      });

      const signer = walletClientToSmartAccountSigner(walletViemClient);

      const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
        signer,
        factoryAddress: process.env.EXPO_PUBLIC_BASE_FACTORY_ADDRESS as Address,
        entryPoint: process.env
          .EXPO_PUBLIC_BASE_ENTRYPOINT_ADDRESS as EntryPoint,
      });
      console.log("🔍 Simple account created!");

      const cloudPaymaster = createPimlicoPaymasterClient({
        chain,
        transport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY as string),
        entryPoint: process.env
          .EXPO_PUBLIC_BASE_ENTRYPOINT_ADDRESS as EntryPoint,
      });
      console.log("🔍 Smart account client created!");

      const smartAccountClient = createSmartAccountClient({
        account: simpleAccount,
        chain,
        bundlerTransport: http(process.env.EXPO_PUBLIC_PAYMASTER_KEY as string),
        middleware: {
          sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
        },
      });
      return smartAccountClient as SmartAccountClientType;
    } catch (error) {
      console.error("Error fetching smart account client:", error);
      return null;
    }
  };

export function useSmartAccountClient() {
  return useQuery<SmartAccountClientType | null, Error>({
    queryKey: ["wallet"],
    queryFn: fetchSmartAccountClient,
  });
}
