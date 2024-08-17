import { createWalletClient, http, createPublicClient } from "viem";
import { createClient } from "@supabase/supabase-js";
import { base, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ABI } from "../../utils/constants";
import { Address } from "viem";

export async function POST(request: Request) {
  try {
    const { postId, realCreator } = await request.json();
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(process.env.EXPO_PUBLIC_RPC_URL!),
    });
    const publicClient = createPublicClient({
      chain,
      transport: http(process.env.EXPO_PUBLIC_RPC_URL!),
    });

    const txHash = await walletClient.writeContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
      abi: ABI,
      functionName: "setRealCreator",
      args: [BigInt(postId), realCreator],
    });
    console.log("✅ Set Real Creator Transaction successfully sponsored!");
    console.log(
      `🔍 View on Blockscout: https://base-sepolia.blockscout.com/tx/${txHash}`
    );
    const txReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as Address,
    });
    if (!txReceipt) throw new Error("Failed to get transaction receipt.");
    const { error } = await supabase
      .from("Posts")
      .update({
        real_creator: realCreator,
      })
      .eq("post_id", postId);
    console.log("✅ Real Creator updated in Supabase!");
    if (error) {
      throw new Error("Failed to update post in Supabase.");
    }
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
