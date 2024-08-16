import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Referral } from "@/utils/types";

const fetchReferrals = async (address: string | undefined) => {
  if (!address) {
    return [];
  }
  const { data, error } = await supabase
    .from("Referrals")
    .select("*")
    .eq("from", address)
    .eq("show", true);

  if (error) {
    throw new Error(`Error fetching referrals: ${error.message}`);
  }

  return data;
};

export const useAlerts = (address: string | undefined) => {
  return useQuery<Referral[], Error>({
    queryKey: ["referral", address],
    queryFn: () => fetchReferrals(address),
  });
};
