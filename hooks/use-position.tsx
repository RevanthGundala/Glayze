import { Post } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Position } from "@/utils/types";

const calculatePosition = async (
  post: Post | null | undefined,
  address: string | undefined,
  price: string | undefined,
  sharesHeld: string | undefined,
  marketValue: string | undefined
): Promise<Position | null> => {
  if (!post || !address || !price || !sharesHeld || !marketValue) {
    return null;
  }

  const { data: trades, error } = await supabase
    .from("Trades")
    .select("usdc, shares, created_at, is_buy")
    .eq("post_id", post.post_id)
    .eq("trader", address);

  if (error) {
    throw error;
  }

  const currentShares = BigInt(sharesHeld);
  const currentPrice = BigInt(price);
  const currentMarketValue = BigInt(marketValue);

  let totalCost = 0n;
  let totalShares = 0n;
  let firstBought: Date | null = null;

  for (const trade of trades) {
    const tradeShares = BigInt(trade.shares as string);
    const tradeUsdc = BigInt(trade.usdc as string);
    const tradeDate = new Date(trade.created_at);

    if (trade.is_buy) {
      totalCost += tradeUsdc;
      totalShares += tradeShares;
      if (!firstBought || tradeDate < firstBought) {
        firstBought = tradeDate;
      }
    } else {
      totalCost -= tradeUsdc;
      totalShares -= tradeShares;
    }
  }

  const averageCost = totalShares > 0n ? totalCost / totalShares : 0n;

  // Calculate returns
  const totalReturn = currentMarketValue - totalCost;
  console.log("totalcost: ", totalCost);
  const totalReturnPercent = totalCost !== 0n ? totalReturn / totalCost : 0n;

  // Calculate today's return based on the change from average cost
  const todaysReturn = 0n;
  const todaysReturnPercent = 0n;

  return {
    averageCost: averageCost.toString(),
    todaysReturn: todaysReturn,
    todaysReturnPercent: todaysReturnPercent,
    totalReturn: totalReturn,
    totalReturnPercent: totalReturnPercent,
    firstBought: firstBought || new Date(),
  };
};

export const usePosition = (
  post: Post | null | undefined,
  address: string | undefined,
  price: string | undefined,
  sharesHeld: string | undefined,
  marketValue: string | undefined
) => {
  return useQuery<Position | null, Error>({
    queryKey: [
      "position",
      post?.post_id,
      address,
      price,
      sharesHeld,
      marketValue,
    ],
    queryFn: () =>
      calculatePosition(post, address, price, sharesHeld, marketValue),
  });
};
