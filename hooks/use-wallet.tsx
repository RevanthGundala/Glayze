import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, Address } from "viem";
import { ABI } from "@/utils/constants";
import { Post } from "@/utils/types";
import { fetchPublicClient } from "./use-public-client";
import { fetchPosts } from "./use-posts";

type Wallet = {
  holdings: Post[];
  xPosts: Post[];
  creations: Post[];
};

const fetchWallet = async (
  address: string | undefined
): Promise<Wallet | null> => {
  if (!address) return null;

  try {
    const data = await fetchPosts();
    if (!data) throw new Error("No posts found");
    const xPosts = data.filter((post) => post.real_creator === address);
    const creations = data.filter((post) => post.contract_creator === address);

    const client = fetchPublicClient();
    if (!client) return null;

    let holdings: Post[] = [];
    for (const post of data) {
      const postId = post.post_id;
      const shares = await client.readContract({
        address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "balanceOf",
        args: [address as Address, BigInt(postId)],
      });
      if (shares > 0) holdings.push(post);
    }

    return {
      holdings,
      xPosts,
      creations,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useWallet(address: string | undefined) {
  return useQuery<Wallet | null, Error>({
    queryKey: ["wallet", address],
    queryFn: () => fetchWallet(address),
  });
}
