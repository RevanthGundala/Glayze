import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Address } from "viem";

const fetchRealCreator = async (
  xUserId: string | null | undefined
): Promise<Address | null> => {
  try {
    if (!xUserId) return null;
    const { data, error } = await supabase
      .from("Users")
      .select("address")
      .eq("x_user_id", xUserId)
      .single();
    if (error) {
      throw new Error(`Error fetching creator: ${error?.message}`);
    }
    return data?.address as Address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useRealCreator(xUserId: string | null | undefined) {
  return useQuery<Address | null, Error>({
    queryKey: ["user", xUserId],
    queryFn: () => fetchRealCreator(xUserId),
  });
}
