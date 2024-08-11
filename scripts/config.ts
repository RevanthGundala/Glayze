import { createWalletClient, createPublicClient, http, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
  account: privateKeyToAccount(process.env.PRIVATE_KEY! as Address),
});
