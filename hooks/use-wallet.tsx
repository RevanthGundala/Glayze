import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { createPublicClient, http, Address } from "viem";
import { baseSepolia, base } from "viem/chains";
import { ABI } from "@/utils/constants";
import { Post } from "@/utils/types";

type Wallet = {
  holdings: Post[];
  xPosts: Post[];
  creations: Post[];
};

const fetchWallet = async (address: string | null): Promise<Wallet | null> => {
  if (!address) return null;
  const { data, error } = await supabase.from("Posts").select("*");

  if (error) {
    throw new Error(`Error fetching referrals: ${error?.message}`);
  }
  try {
    const xPosts = data.filter((post) => post.real_creator === address);
    const creations = data.filter((post) => post.contract_creator === address);

    const chain = process.env.EXPO_PUBLIC_CHAIN === "base" ? base : baseSepolia;
    const client = createPublicClient({
      chain,
      transport: http(),
    });

    let holdings: Post[] = [];
    for (const post of data) {
      const postId = post.post_id;
      const shares = await client.readContract({
        address: process.env.CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "balanceOf",
        args: [address as Address, postId],
      });
      console.log(shares);
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

export function useWallet(address: string | null) {
  return useQuery<Wallet | null, Error>({
    queryKey: ["user", address],
    queryFn: () => fetchWallet(address),
  });
}
