import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";
import { parseUSDC } from "@/utils/helpers";

type SellPrice = {
  sellPrice: string;
  sellPriceAfterFees: string;
  totalFees: string;
};

const fetchSellPrice = async (
  postId: string | null,
  shares: string | null,
  auraAmount: string | null,
  sharesOwned: string | null
): Promise<SellPrice> => {
  if (!postId || !shares || !auraAmount || !sharesOwned) {
    throw new Error("Missing required parameters");
  }
  if (shares === "0") {
    throw new Error("Shares amount must be greater than 0");
  }
  if (Number(sharesOwned) < Number(shares)) {
    throw new Error("Not enough shares");
  }

  const client = fetchPublicClient();
  if (!client) {
    throw new Error("Failed to fetch public client");
  }

  try {
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
      args: [BigInt(postId), BigInt(shares), BigInt(parseUSDC(auraAmount))],
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
    console.error("Error in fetchSellPrice:", error);
    throw error; // Re-throw the error instead of returning null
  }
};

export function useSellPrice(
  postId: string | null,
  shares: string | null,
  auraAmount: string | null,
  sharesOwned: string | null
) {
  return useQuery<SellPrice, Error>({
    queryKey: ["sellPrice", postId, shares, auraAmount, sharesOwned],
    queryFn: () => fetchSellPrice(postId, shares, auraAmount, sharesOwned),
    retry: false, // Disable retries for faster error reporting
  });
}
