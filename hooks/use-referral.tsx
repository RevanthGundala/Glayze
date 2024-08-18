import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Address } from "viem";
import { Referral } from "@/utils/types";

export const fetchReferral = async (
  dynamicId: string | null | undefined
): Promise<Referral | null> => {
  try {
    if (!dynamicId) return null;
    const { data, error } = await supabase
      .from("Referrals")
      .select("*")
      .eq("dynamic_id", dynamicId)
      .single();
    if (error || !data) {
      throw new Error(`Error fetching creator: ${error?.message}`);
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useReferral(dynamicId: string | null | undefined) {
  return useQuery<Referral | null, Error>({
    queryKey: ["refer", dynamicId],
    queryFn: () => fetchReferral(dynamicId),
  });
}
