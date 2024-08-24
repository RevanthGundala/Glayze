import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export const fetchRealCreator = async (
  xUserId: string | null | undefined
): Promise<Address | null> => {
  try {
    if (!xUserId) return null;
    const res = await fetch(`/api/supabase/users?xUserId=${xUserId}`);
    const data = await res.json();
    return data?.data.address as Address;
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
