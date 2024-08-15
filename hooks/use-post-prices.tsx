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

interface Trade {
  price: number | null;
  created_at: string;
}

const fetchPostPrices = async (
  id: string | null | undefined,
  time: Time
): Promise<PostPrices | null> => {
  if (!id) return null;
  let prices: number[] = [];
  let price_change: number = 0;
  const { data: trades, error } = await supabase
    .from("Trades")
    .select("price, created_at")
    .eq("post_id", id);
  if (error) {
    throw error;
  }
  const now = new Date();
  const filterAndMapTrades = (startDate: Date): number[] => {
    return trades
      .filter((trade: Trade) => new Date(trade.created_at) >= startDate)
      .map((trade: Trade) => trade.price)
      .filter((price): price is number => price !== null);
  };

  if (time === "1D") {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    prices = filterAndMapTrades(oneDayAgo);
    price_change = calculatePercentChange(prices[0], prices[2]);
  } else if (time === "1W") {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    prices = filterAndMapTrades(oneWeekAgo);
    price_change = calculatePercentChange(prices[0], prices[3]);
  } else if (time === "1M") {
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    prices = filterAndMapTrades(oneMonthAgo);
    price_change = calculatePercentChange(prices[0], prices[4]);
  } else if (time === "ALL") {
    prices = trades
      .map((trade: Trade) => trade.price)
      .filter((price): price is number => price !== null);
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

export const usePostPrices = (id: string | null | undefined, time: Time) => {
  return useQuery<PostPrices | null, Error>({
    queryKey: ["time", id, time],
    queryFn: () => fetchPostPrices(id, time),
  });
};
