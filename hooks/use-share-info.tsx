import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { ABI } from "../utils/constants";

type ShareInfo = {
  price: number;
  supply: number;
};

export const fetchShareInfo = async (
  post_id: number | null
): Promise<ShareInfo | null> => {
  if (!post_id) return null;
  try {
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const client = createPublicClient({
      chain,
      transport: http(),
    });
    const shareInfo = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "shareInfo",
      args: [BigInt(post_id)],
    });
    console.log(shareInfo);
    return {
      price: Number(shareInfo[0]),
      supply: Number(shareInfo[1]),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useShareInfo(post_id: number | null) {
  return useQuery<ShareInfo | null, Error>({
    queryKey: ["post", post_id],
    queryFn: () => fetchShareInfo(post_id),
  });
}
