import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";

type SellPrice = {
  sellPrice: string;
  sellPriceAfterFees: string;
  totalFees: string;
};

const fetchSellPrice = async (
  postId: string | null,
  shares: string | null
): Promise<SellPrice | null> => {
  if (!postId || !shares || shares === "0") return null;
  try {
    const client = fetchPublicClient();
    if (!client) return null;
    const sellPrice = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getSellPrice",
      args: [BigInt(postId), BigInt(shares)],
    });

    const sellPriceAfterFees = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getSellPriceAfterFees",
      args: [BigInt(postId), BigInt(shares)],
    });

    const totalFees = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getTotalFees",
      args: [BigInt(postId), BigInt(shares)],
    });

    return {
      sellPrice: sellPrice.toString(),
      sellPriceAfterFees: sellPriceAfterFees.toString(),
      totalFees: totalFees.toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useSellPrice(postId: string | null, shares: string | null) {
  return useQuery<SellPrice | null, Error>({
    queryKey: ["sellPrice", postId, shares],
    queryFn: () => fetchSellPrice(postId, shares),
  });
}
