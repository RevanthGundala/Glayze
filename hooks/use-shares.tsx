import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";
import { fetchShareInfo } from "./use-share-info";

type Share = {
  number: string;
  value: string;
};

const fetchShares = async (
  address: string | undefined,
  postId: string | null
): Promise<Share | null> => {
  if (!address || !postId) return null;
  try {
    const client = fetchPublicClient();
    if (!client) return null;

    const shares = await client.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "balanceOf",
      args: [address as Address, BigInt(postId)],
    });
    const shareInfo = await fetchShareInfo(postId);
    console.log("shareInfo", shareInfo);
    if (!shareInfo) return null;
    return {
      number: shares.toString(),
      value: (Number(shareInfo.price) * Number(shares)).toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useShares(address: string | undefined, postId: string | null) {
  return useQuery<Share | null, Error>({
    queryKey: ["shares", address, postId],
    queryFn: () => fetchShares(address, postId),
  });
}
