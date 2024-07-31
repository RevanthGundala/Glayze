import { useState } from "react";
import { Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const fetchPosts = async (selectedTab: string) => {
  const { data, error } = await supabase.from("Posts").select("*");

  if (error) {
    throw new Error(`Error fetching referrals: ${error.message}`);
  }

  if (selectedTab === "Trending") {
    return data.sort((a, b) => b.price - a.price); // TODO: function to get 1% change
  } else if (selectedTab === "New") {
    return data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (selectedTab === "Top") {
    return data.sort((a, b) => b.price - a.price);
  } else {
    return [];
  }
};

export const usePosts = (selectedTab: string) => {
  return useQuery<Post[], Error>({
    queryKey: ["posts", selectedTab],
    queryFn: () => fetchPosts(selectedTab),
  });
};
