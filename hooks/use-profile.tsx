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
  // TODO: get user address from wallet
  const { user } = usePrivy();

  return useQuery<User | null, Error>({
    queryKey: ["user", user?.wallet.address],
    queryFn: () => fetchUser(user?.wallet.address),
  });
};
