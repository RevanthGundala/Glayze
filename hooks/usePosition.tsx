import { Position, Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const calculatePosition = async (
  post: Post | null | undefined,
  address: string
): Promise<Position | null> => {
  if (!post) return null;
  const { data: trades, error } = await supabase
    .from("Trades")
    .select("usdc_amount, token_amount, created_at")
    .eq("post_id", post.post_id)
    .eq("from", address)
    .eq("is_buy", true);

  if (error) {
    throw error;
  }

  let tokens = 0; // TODO: read from chain
  let totalValueInvested = 0;
  let firstBought = new Date();

  trades.forEach((trade) => {
    tokens += trade.token_amount;
    totalValueInvested += trade.usdc_amount;
    if (trade.created_at < firstBought) {
      firstBought = trade.created_at;
    }
  });

  const currentPrice = post.price ?? 0;
  const marketValue = currentPrice * tokens;
  const averageCost = tokens > 0 ? totalValueInvested / tokens : 0;

  const todaysReturn = marketValue - averageCost * tokens;
  const todaysReturnPercent =
    averageCost > 0 ? (todaysReturn / (averageCost * tokens)) * 100 : 0;

  const totalReturn = marketValue - totalValueInvested;
  const totalReturnPercent =
    totalValueInvested > 0 ? (totalReturn / totalValueInvested) * 100 : 0;

  return {
    tokens,
    totalValueInvested,
    marketValue,
    averageCost,
    todaysReturn,
    todaysReturnPercent,
    totalReturn,
    totalReturnPercent,
    currentPrice,
    firstBought,
  };
};

export const usePosition = (post: Post | null | undefined, address: string) => {
  return useQuery<Position | null, Error>({
    queryKey: ["position", post?.post_id, address],
    queryFn: () => calculatePosition(post, address),
  });
};
