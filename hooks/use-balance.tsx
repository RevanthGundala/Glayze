import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { ERC20_ABI } from "../utils/constants";
import { fetchPublicClient } from "./use-public-client";

const fetchBalance = async (
  address: string | undefined
): Promise<string | null> => {
  if (!address) return null;
  try {
    const client = fetchPublicClient();
    if (!client) return null;

    const usdcBalance = await client.readContract({
      address: process.env.EXPO_PUBLIC_USDC_ADDRESS as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as Address],
    });
    return usdcBalance.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useBalance(address: string | undefined) {
  return useQuery<string | null, Error>({
    queryKey: ["balance", address],
    queryFn: () => fetchBalance(address),
  });
}
