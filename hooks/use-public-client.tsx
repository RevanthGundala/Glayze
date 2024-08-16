import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address, PublicClient } from "viem";
import { baseSepolia, base } from "viem/chains";

export const fetchPublicClient = (): PublicClient<any> | null => {
  try {
    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const client = createPublicClient({
      chain,
      transport: http(process.env.EXPO_PUBLIC_RPC_URL as string),
    });
    return client;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function usePublicClient() {
  return useQuery<PublicClient<any> | null, Error>({
    queryKey: ["public-client"],
    queryFn: () => fetchPublicClient(),
  });
}
