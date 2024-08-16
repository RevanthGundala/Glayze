import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ERC20_ABI } from "../utils/constants";
import { fetchPublicClient } from "./use-public-client";

const fetchAura = async (
  address: string | undefined
): Promise<string | null> => {
  console.log("fetching aura");
  if (!address) return null;
  try {
    const client = fetchPublicClient();
    if (!client) return null;
    const balance = await client.readContract({
      address: process.env.EXPO_PUBLIC_AURA_ADDRESS as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as Address],
    });
    console.log("aura balance:", balance.toString());
    return balance.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useAura(address: string | undefined) {
  return useQuery<string | null, Error>({
    queryKey: ["aura", address],
    queryFn: () => fetchAura(address),
  });
}
