import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { User } from "@/utils/types";
import { usePrivy } from "@/utils/privy";

const fetchUser = async (address: string | null) => {
  if (!address) return null;
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("address", address)
    .single();
  return error ? null : data;
};

export const useProfile = () => {
  const { user } = usePrivy();
  const testAddress = "0x8f27d80416B9bd94a0C4640b514DCa782A02A1D3";

  return useQuery<User | null, Error>({
    queryKey: ["user", user?.wallet.address],
    queryFn: () => fetchUser(user?.wallet.address ?? testAddress),
  });
};
