import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const fetchSearchHistory = async (
  privyId: string | undefined
): Promise<string[] | null> => {
  if (!privyId) return null;
  const { data, error } = await supabase
    .from("Search")
    .select("content")
    .eq("privy_id", privyId);

  if (error) {
    throw new Error(`Error fetching search history: ${error.message}`);
  }

  return data
    .filter((item): item is { content: string } => item.content !== null)
    .map((item) => item.content);
};

export function useSearch(privyId: string | undefined) {
  return useQuery<string[] | null, Error>({
    queryKey: ["search-history", privyId],
    queryFn: () => fetchSearchHistory(privyId),
  });
}
