import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const completeReferral = async (address: string, to?: string) => {
  if (!address) return null;
  const { data, error } = await supabase
    .from("Users")
    .select("referral_code")
    .eq("address", address)
    .single();

  if (error) {
    throw new Error(`Error fetching referrals: ${error.message}`);
  }

  const refer = async () => {
    if (!to) return;
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("num_referrals")
      .eq("address", address)
      .single();

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    const currentReferrals = userData?.num_referrals || 0;

    const { error } = await supabase
      .from("Users")
      .update({ num_referrals: currentReferrals + 1 })
      .eq("address", address)
      .single();

    if (error) {
      throw new Error(`Error updating referrals: ${error.message}`);
    }

    // TODO: call function on eth
  };

  return { referralLink: data?.referral_code, refer };
};

interface Referral {
  referralLink: string;
  refer: () => void;
}

export const useReferral = (address: string, to?: string) => {
  return useQuery<Referral | null, Error>({
    queryKey: ["referal_link", address],
    queryFn: () => completeReferral(address, to),
  });
};
