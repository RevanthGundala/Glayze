import { useQuery } from "@tanstack/react-query";

const fetchSearchHistory = async (
  privyId: string | undefined
): Promise<string[] | null> => {
  if (!privyId) return null;
  let searchHistory: any[] = [];
  try {
    const response = await fetch(`/api/supabase/search?privyId=${privyId}`);
    const data = await response.json();
    searchHistory = data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching search history`);
  }

  return searchHistory
    .filter((item): item is { content: string } => item.content !== null)
    .map((item) => item.content);
};

export function useSearch(privyId: string | undefined) {
  return useQuery<string[] | null, Error>({
    queryKey: ["search-history", privyId],
    queryFn: () => fetchSearchHistory(privyId),
  });
}
