import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { USDC_ABI } from "../utils/constants";

const fetchBalance = async (address: string | null): Promise<string | null> => {
  if (!address) return null;
  try {
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const client = createPublicClient({
      chain,
      transport: http(),
    });
    const balance = (await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [address],
    })) as unknown as bigint;
    return balance.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useBalance(address: string | null) {
  return useQuery<string | null, Error>({
    queryKey: ["user", address],
    queryFn: () => fetchBalance(address),
  });
}
