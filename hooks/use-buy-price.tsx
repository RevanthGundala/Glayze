import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";
9;

type BuyPrice = {
  buyPrice: string;
  buyPriceAfterFees: string;
  totalFees: string;
};

const fetchBuyPrice = async (
  postId: string | null,
  shares: string | null,
  auraAmount: string | null
): Promise<BuyPrice | null> => {
  if (!postId || !shares || !auraAmount) return null;
  if (shares === "0")
    return { buyPrice: "0", buyPriceAfterFees: "0", totalFees: "0" };
  try {
    const client = fetchPublicClient();
    if (!client) return null;
    const buyPrice = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getBuyPrice",
      args: [BigInt(postId), BigInt(shares)],
    });
    const buyPriceAfterFees = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getBuyPriceAfterFees",
      args: [BigInt(postId), BigInt(shares), BigInt(auraAmount)],
    });
    console.log("Buy Price After Fees: ", buyPriceAfterFees.toString());
    const totalFees = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "getTotalFees",
      args: [BigInt(postId), BigInt(shares)],
    });

    return {
      buyPrice: buyPrice.toString(),
      buyPriceAfterFees: buyPriceAfterFees.toString(),
      totalFees: totalFees.toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useBuyPrice(
  postId: string | null,
  shares: string | null,
  auraAmount: string | null
) {
  return useQuery<BuyPrice | null, Error>({
    queryKey: ["buyPrice", postId, shares, auraAmount],
    queryFn: () => fetchBuyPrice(postId, shares, auraAmount),
  });
}
