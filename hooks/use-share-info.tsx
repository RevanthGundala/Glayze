import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { ABI } from "../utils/constants";
import { fetchPublicClient } from "./use-public-client";

type ShareInfo = {
  price: string;
  supply: string;
};

export const fetchShareInfo = async (
  post_id: string | null
): Promise<ShareInfo | null> => {
  if (!post_id) return null;
  try {
    const client = fetchPublicClient();
    if (!client) return null;
    const shareInfo = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "shareInfo",
      args: [BigInt(post_id)],
    });
    return {
      price: shareInfo[0].toString(),
      supply: shareInfo[1].toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useShareInfo(post_id: string | null) {
  return useQuery<ShareInfo | null, Error>({
    queryKey: ["post", post_id],
    queryFn: () => fetchShareInfo(post_id),
  });
}
