import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { AURA_ABI } from "../utils/constants";

const fetchAura = async (
  address: string | undefined
): Promise<string | null> => {
  if (!address) return null;
  try {
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const client = createPublicClient({
      chain,
      transport: http(),
    });
    const balance = (await client.readContract({
      address: process.env.EXPO_PUBLIC_AURA_CONTRACT_ADDRESS as Address,
      abi: AURA_ABI,
      functionName: "balanceOf",
      args: [address],
    })) as unknown as bigint;
    return balance.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useAura(address: string | undefined) {
  return useQuery<string | null, Error>({
    queryKey: ["user", address],
    queryFn: () => fetchAura(address),
  });
}
