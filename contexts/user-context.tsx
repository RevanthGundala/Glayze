import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Tables } from "@/utils/types";
import { User as PrivyUser } from "@privy-io/expo";
import { usePrivy } from "@/utils/privy";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { useSmartAccount } from "@/hooks";

interface UserContextType {
  data: {
    db: Tables["Users"]["Row"] | null;
    privy: PrivyUser | null;
    smartAccount: BiconomySmartAccountV2 | null;
  };
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = usePrivy();
  const {
    smartAccount,
    isLoading: isSmartAccountLoading,
    error: smartAccountError,
  } = useSmartAccount();

  const { data, isLoading, error } = useQuery<
    Tables["Users"]["Row"] | null,
    Error
  >({
    queryKey: ["user"],
    queryFn: async () => {
      if (!user || !smartAccount) {
        return null;
      }

      const address = await smartAccount.getAccountAddress();
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("address", address)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user && !!smartAccount && !isSmartAccountLoading,
  });

  const value: UserContextType = {
    data: {
      db: data || null,
      privy: user || null,
      smartAccount: smartAccount || null,
    },
    isLoading: isLoading || isSmartAccountLoading,
    error: error || smartAccountError || null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
