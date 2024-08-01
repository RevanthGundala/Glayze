import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { User } from "@/utils/types";

const fetchUser = async (address: string) => {
  console.log("Fetching user");
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("address", address)
    .single();
  return error ? null : data;
};

export const useProfile = () => {
  // TODO: get user address from wallet
  const address = "0x1234567890abcdef1234567890abcdef12345678";

  return useQuery<User | null, Error>({
    queryKey: ["user", address],
    queryFn: () => fetchUser(address),
  });
};
