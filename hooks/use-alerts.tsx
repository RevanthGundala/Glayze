import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Referral } from "@/utils/types";

const fetchReferrals = async (address: string) => {
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

export const useAlerts = () => {
  // TODO: get user address from wallet
  const address = "0x1234567890abcdef1234567890abcdef12345678";

  return useQuery<Referral[], Error>({
    queryKey: ["referral", address],
    queryFn: () => fetchReferrals(address),
  });
};
