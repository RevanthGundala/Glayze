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
    .select("usdc, shares, fees, created_at, is_buy")
    .eq("post_id", post.post_id)
    .eq("trader", address);

  if (error) {
    throw error;
  }

  const currentShares = BigInt(sharesHeld);
  const currentPrice = BigInt(price);
  const currentMarketValue = BigInt(marketValue);

  let totalBought = 0n;
  let totalSold = 0n;
  let totalShares = 0n;
  let totalFees = 0n;
  let firstBought: Date | null = null;

  for (const trade of trades) {
    const tradeShares = BigInt(trade.shares as string);
    const tradeUsdc = BigInt(trade.usdc as string);
    const tradeFees = BigInt(trade.fees as string);
    const tradeDate = new Date(trade.created_at);

    if (trade.is_buy) {
      totalBought += tradeUsdc + tradeFees;
      totalShares += tradeShares;
      if (!firstBought || tradeDate < firstBought) {
        firstBought = tradeDate;
      }
    } else {
      totalSold += tradeUsdc - tradeFees;
      totalShares -= tradeShares;
    }
    totalFees += tradeFees;
  }

  let totalReturn: bigint;
  let totalReturnPercent: bigint;

  const lastKnownPrice = trades[trades.length - 1]?.usdc;
  const remainingValue = BigInt(totalShares) * BigInt(lastKnownPrice!);
  totalReturn = totalSold - totalBought + remainingValue;
  totalReturnPercent = 0n;

  const averageCost =
    currentShares > 0n ? (totalBought - totalSold) / currentShares : 0n;

  // Today's return is 0 if no shares are held
  const todaysReturn =
    currentShares > 0n ? currentMarketValue - averageCost * currentShares : 0n;
  const todaysReturnPercent =
    averageCost !== 0n && currentShares > 0n
      ? (todaysReturn * 10000n) / (averageCost * currentShares)
      : 0n;

  console.log("Total Bought:", totalBought.toString());
  console.log("Total Sold:", totalSold.toString());
  console.log("Total Fees:", totalFees.toString());
  console.log("Total Return:", totalReturn.toString());

  return {
    averageCost: averageCost.toString(),
    todaysReturn,
    todaysReturnPercent,
    totalReturn,
    totalReturnPercent,
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
