import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";
import { parseUSDC } from "@/utils/helpers"; // Make sure to import parseUSDC

type SellPrice = {
  sellPrice: string;
  sellPriceAfterFees: string;
  totalFees: string;
};

const fetchSellPrice = async (
  postId: string | null,
  shares: string | null,
  auraAmount: string | null
): Promise<SellPrice | null> => {
  if (!postId || !shares || !auraAmount) return null;
  if (shares === "0")
    return { sellPrice: "0", sellPriceAfterFees: "0", totalFees: "0" };
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
      args: [BigInt(postId), BigInt(shares), BigInt(parseUSDC(auraAmount))],
    });
    console.log("Sell Price After Fees: ", sellPriceAfterFees.toString());
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
    return null;
  }
};

export function useSellPrice(
  postId: string | null,
  shares: string | null,
  auraAmount: string | null
) {
  return useQuery<SellPrice | null, Error>({
    queryKey: ["sellPrice", postId, shares, auraAmount],
    queryFn: () => fetchSellPrice(postId, shares, auraAmount),
  });
}
