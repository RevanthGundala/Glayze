import { Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const fetchPost = async (id: string | string[] | null | undefined) => {
  if (!id) return null;
  const { data, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("post_id", id)
    .single();
  if (error) {
    console.log(error);
    throw new Error(`Error fetching posts: ${error.message}`);
  }

  return data;
};

export const usePost = (id: string | string[] | null | undefined) => {
  return useQuery<Post | null, Error>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });
};
