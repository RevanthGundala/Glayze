import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Search } from "@/utils/types";

const fetchSearchHistory = async (address: string) => {
  const { data, error } = await supabase
    .from("Search")
    .select("*")
    .eq("address", address);

  if (error) {
    throw new Error(`Error fetching referrals: ${error.message}`);
  }

  return data;
};

export function useSearch() {
  const address = "0x1234567890abcdef1234567890abcdef12345678";
  return useQuery<Search[], Error>({
    queryKey: ["user", address],
    queryFn: () => fetchSearchHistory(address),
  });
}
