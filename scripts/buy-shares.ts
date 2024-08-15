import {
  Address,
  createPublicClient,
  http,
  encodeFunctionData,
  createWalletClient,
} from "viem";
import { baseSepolia } from "viem/chains";
import { ERC20_ABI, ABI } from "../utils/constants";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
import path from "path";
import {
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  privateKeyToSimpleSmartAccount,
  SmartAccount,
} from "permissionless/accounts";
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { SmartAccountClient } from "permissionless";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.development") });

type TransactionInput = {
  postId: string;
  shares: string;
};

const data: TransactionInput[] = [
  {
    postId: "1811899344876110166",
    shares: "2",
  },
];

const chain = baseSepolia;
const paymaster = process.env.EXPO_PUBLIC_PAYMASTER_KEY as string;

async function main(inputArray: TransactionInput[]) {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
    privateKey: process.env.PRIVATE_KEY as Address,
    factoryAddress: "0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232",
    entryPoint: ENTRYPOINT_ADDRESS_V06,
  });

  const cloudPaymaster = createPimlicoPaymasterClient({
    chain,
    transport: http(paymaster),
    entryPoint: ENTRYPOINT_ADDRESS_V06,
  });

  const smartAccountClient = createSmartAccountClient({
    account: simpleAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chain,
    bundlerTransport: http(paymaster),
    middleware: {
      sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
    },
  });

  console.log("🔍 Smart account client created!");

  console.log("Smarta ccoutn address: ", smartAccountClient.account.address);

  for (const input of inputArray) {
    const { postId, shares } = input;
    const transactions = [
      {
        to: process.env.EXPO_PUBLIC_USDC_ADDRESS! as Address,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "approve",
          args: [
            process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
            BigInt("100000000"), // random approval amount
          ],
        }),
        value: 0n,
      },
      {
        to: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "buyShares",
          args: [BigInt(postId as string), BigInt(shares), BigInt(0)],
        }),
        value: 0n,
      },
    ];

    const txHash = await smartAccountClient?.sendTransactions({
      transactions,
    });
    console.log("✅ Transaction successfully sponsored!");
    console.log(
      `🔍 View on Blockscout: https://base-sepolia.blockscout.com/tx/${txHash}`
    );
    const txReceipt = await publicClient?.waitForTransactionReceipt({
      hash: txHash as Address,
    });
    console.log(txReceipt);
  }
}

main(data)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
