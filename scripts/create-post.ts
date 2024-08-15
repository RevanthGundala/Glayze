import { Address, parseUnits, formatUnits } from "viem";
import dotenv from "dotenv";
import path from "path";
import { createWalletClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.development") });

// Setup wallet and public clients
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Import ABI
import { ABI, ERC20_ABI } from "../utils/constants";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Types
interface CreatePostInput {
  postId: string;
  name: string;
  symbol: string;
  image: string;
  url: string;
}

export const data: CreatePostInput[] = [
  {
    postId: "1811899344876110166",
    name: "COCONUT",
    symbol: "$COCONUT",
    image: "https://pbs.twimg.com/media/GT5XVL2XIAARtwf?format=jpg&name=medium",
    url: "https://x.com/DineshDSouza/status/1811899344876110166",
  },
  {
    postId: "1812254933120676115",
    name: "DJT Shooter",
    symbol: "$SHOOTER",
    image: "https://pbs.twimg.com/media/GT5XVL2XIAARtwf?format=jpg&name=medium",
    url: "https://twitter.com/omgitsbirdman/status/1812254933120676115",
  },
  {
    postId: "1818987328557211991",
    name: "Turkey Olympics Shooting",
    symbol: "$TURKEY",
    image: "https://pbs.twimg.com/media/GT5XVL2XIAARtwf?format=jpg&name=medium",
    url: "https://x.com/CFC_Janty/status/1818987328557211991",
  },
];

const main = async (inputArray: CreatePostInput[]) => {
  const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address;
  const usdcAddress = process.env.EXPO_PUBLIC_USDC_ADDRESS as Address;
  const approvalAmount = parseUnits("1", 6); // 1 USDC = 1 * 10^6
  for (const input of inputArray) {
    const { postId, name, symbol, url, image } = input;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/ipfs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          postId,
          name,
          symbol,
          image,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to upload metadata to IPFS: ${
          errorData ? JSON.stringify(errorData) : response.statusText
        }`
      );
    }

    const { metadataIpfsHash, imageIpfsHash } = await response.json();
    console.log("Metadata IPFS Hash:", metadataIpfsHash);

    const usdcBalance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [account.address],
    });
    console.log(`USDC Balance: ${formatUnits(usdcBalance, 6)} USDC`);

    // Check USDC allowance
    const usdcAllowance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [account.address, contractAddress],
    });
    console.log(`USDC Allowance: ${formatUnits(usdcAllowance, 6)} USDC`);

    const approvalTx = await walletClient.writeContract({
      address: process.env.EXPO_PUBLIC_USDC_ADDRESS as Address,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [contractAddress, approvalAmount],
    });
    console.log("Approval transaction hash:", approvalTx);
    const approvalTxReceipt = await publicClient.waitForTransactionReceipt({
      hash: approvalTx,
    });
    console.log("Approval transaction receipt successfully mined!");
    const txHash = await walletClient.writeContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
      abi: ABI,
      functionName: "createPost",
      args: [BigInt(postId), name, symbol, metadataIpfsHash],
    });
    console.log("✅ Transaction successfully sponsored!");
    console.log(
      `🔍 View on Etherscan: https://sepolia.basescan.org/tx/${txHash}`
    );
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    const { error } = await supabase.from("Posts").upsert([
      {
        post_id: postId, 
        name,
        symbol,
        url,
        contract_creator: walletClient.account.address,
        image_uri: imageIpfsHash,
        volume: 0,
        ath: 0,
      },
    ]);
    if (error) {
      throw new Error("Failed to create post in Supabase.");
    }
  }
};

main(data)
  .then(console.log("Done!"))
  .catch((e) => console.log(e.cause));
