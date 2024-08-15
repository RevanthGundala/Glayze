import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { ABI } from "@/utils/constants";
import { fetchPublicClient } from "./use-public-client";

type Constants = {
  usdcCreationPayment: string;
};

const fetchConstants = async (): Promise<Constants | null> => {
  try {
    const client = fetchPublicClient();
    if (!client) return null;
    const usdcCreatePayment = await client?.readContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
      abi: ABI,
      functionName: "usdcCreationPayment",
    });

    return {
      usdcCreationPayment: usdcCreatePayment.toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function useConstants() {
  return useQuery<Constants | null, Error>({
    queryKey: ["constants"],
    queryFn: () => fetchConstants(),
  });
}
