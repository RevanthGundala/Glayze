import { Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const fetchPost = async (id: string | string[] | null | undefined) => {
  try {
    const res = await fetch(`/api/supabase/post?id=${id}`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const usePost = (id: string | string[] | null | undefined) => {
  return useQuery<Post | null, Error>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });
};
