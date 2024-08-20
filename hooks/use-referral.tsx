import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Referral } from "@/utils/types";

export const fetchReferral = async (
  referee: string | null | undefined
): Promise<Referral[] | null> => {
  try {
    if (!referee) return null;
    const { data, error } = await supabase
      .from("Referrals")
      .select("*")
      .eq("referee", referee)
      .eq("show", true);
    if (error || !data) {
      throw new Error(`Error fetching creator: ${error?.message}`);
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useReferral(referee: string | null | undefined) {
  return useQuery<Referral[] | null, Error>({
    queryKey: ["refer", referee],
    queryFn: () => fetchReferral(referee),
  });
}
