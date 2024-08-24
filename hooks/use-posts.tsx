import { Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicClient } from "./use-public-client";
import { ABI } from "@/utils/constants";
import { Address } from "viem";

export const fetchPosts = async (): Promise<Post[] | null> => {
  try {
    const res = await fetch(`/api/supabase/post`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchPostInfo = async (selectedTab: string): Promise<Post[]> => {
  try {
    const posts = await fetchPosts();
    if (!posts) return [];
    const publicClient = fetchPublicClient();
    if (!publicClient) throw new Error("No public client found.");

    const prices = await Promise.all(
      posts.map(async (post) => {
        const shareInfo = await publicClient.readContract({
          address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
          abi: ABI,
          functionName: "shareInfo",
          args: [BigInt(post.post_id)],
        });
        return shareInfo[0] as bigint;
      })
    );

    const indexMap = Array.from(Array(posts.length).keys());

    if (selectedTab === "Trending") {
      // TODO: Implement actual trending logic
      indexMap.sort((a, b) => Number(prices[b] - prices[a]));
    } else if (selectedTab === "New") {
      indexMap.sort(
        (a, b) =>
          new Date(posts[b].created_at).getTime() -
          new Date(posts[a].created_at).getTime()
      );
    } else if (selectedTab === "Top") {
      indexMap.sort((a, b) => Number(prices[b] - prices[a]));
    }

    return indexMap.map((index) => posts[index]);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const usePosts = (selectedTab: string) => {
  return useQuery<Post[], Error>({
    queryKey: ["posts", selectedTab],
    queryFn: () => fetchPostInfo(selectedTab),
  });
};
