import { Position, Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { ABI } from "@/utils/constants";

const calculatePosition = async (
  post: Post | null | undefined,
  address: string | undefined,
  price: number | undefined
): Promise<Position | null> => {
  if (!post || !address) return null;
  const { data: trades, error } = await supabase
    .from("Trades")
    .select("usdc, shares, created_at")
    .eq("post_id", post.post_id)
    .eq("from", address)
    .eq("is_buy", true);

  if (error) {
    throw error;
  }

  const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
  const client = createPublicClient({
    chain,
    transport: http(),
  });

  const shares = parseFloat(
    await client
      .readContract({
        address: process.env.CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "balanceOf",
        args: [address as Address, BigInt(post.post_id)],
      })
      .toString()
  );
  let totalValueInvested = 0;
  let firstBought = new Date();

  trades.forEach((trade) => {
    totalValueInvested += trade.usdc;
    if (trade.created_at < firstBought) {
      firstBought = trade.created_at;
    }
  });

  const marketValue = price ? price * shares : 0;
  const averageCost = shares > 0 ? totalValueInvested / shares : 0;

  const todaysReturn = marketValue - averageCost * shares;
  const todaysReturnPercent =
    averageCost > 0 ? (todaysReturn / (averageCost * shares)) * 100 : 0;

  const totalReturn = marketValue - totalValueInvested;
  const totalReturnPercent =
    totalValueInvested > 0 ? (totalReturn / totalValueInvested) * 100 : 0;

  return {
    shares,
    totalValueInvested,
    marketValue,
    averageCost,
    todaysReturn,
    todaysReturnPercent,
    totalReturn,
    totalReturnPercent,
    firstBought,
  };
};

export const usePosition = (
  post: Post | null | undefined,
  address: string | undefined,
  price: number | undefined
) => {
  return useQuery<Position | null, Error>({
    queryKey: ["position", post?.post_id, address],
    queryFn: () => calculatePosition(post, address, price),
  });
};
