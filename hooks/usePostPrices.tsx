import { Post, Time } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const calculatePercentChange = (
  newValue: number | undefined,
  originalValue: number | undefined
): number => {
  if (newValue === undefined || originalValue === undefined) {
    return 0;
  }
  return ((newValue - originalValue) / originalValue) * 100;
};

const fetchPostPrices = async (id: number | null | undefined, time: Time) => {
  if (!id) return null;
  let prices, price_change;
  const { data: trades, error } = await supabase
    .from("Trades")
    .select("price, created_at")
    .eq("post_id", id);
  if (error) {
    throw error;
  }
  const now = new Date();
  if (time === "1D") {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    prices = trades
      .filter((trade) => new Date(trade.created_at) >= oneDayAgo)
      .map((trade) => trade.price);
    price_change = calculatePercentChange(prices[0], prices[2]);
  } else if (time === "1W") {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    prices = trades
      .filter((trade) => new Date(trade.created_at) >= oneWeekAgo)
      .map((trade) => trade.price);
    price_change = calculatePercentChange(prices[0], prices[3]);
  } else if (time === "1M") {
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    prices = trades
      .filter((trade) => new Date(trade.created_at) >= oneMonthAgo)
      .map((trade) => trade.price);
    price_change = calculatePercentChange(prices[0], prices[4]);
  } else if (time === "ALL") {
    prices = trades.map((trade) => trade.price);
    price_change = calculatePercentChange(prices[0], prices[prices.length - 1]);
  } else {
    prices = [];
    price_change = 0;
  }
  return { prices, price_change };
};

interface PostPrices {
  prices: number[];
  price_change: number;
}

export const usePostPrices = (id: number | null | undefined, time: Time) => {
  return useQuery<PostPrices | null, Error>({
    queryKey: ["time", time],
    queryFn: () => fetchPostPrices(id, time),
  });
};
