import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Search } from "@/utils/types";

const fetchSearchHistory = async (address: string | undefined) => {
  if (!address) return null;
  const { data, error } = await supabase
    .from("Search")
    .select("*")
    .eq("address", address);

  if (error) {
    throw new Error(`Error fetching referrals: ${error.message}`);
  }

  return data;
};

export function useSearch(address: string | undefined) {
  return useQuery<Search[] | null, Error>({
    queryKey: ["user", address],
    queryFn: () => fetchSearchHistory(address),
  });
}
