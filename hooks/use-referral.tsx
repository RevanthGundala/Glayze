import { useQuery } from "@tanstack/react-query";
import { Referral } from "@/utils/types";

export const fetchReferral = async (
  referee: string | null | undefined
): Promise<Referral[] | null> => {
  try {
    if (!referee) return null;
    const response = await fetch(`/api/supabase/referrals?referee=${referee}`);
    const data = await response.json();
    return data.data;
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
