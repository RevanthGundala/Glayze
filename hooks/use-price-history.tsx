import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const DECIMALS = 6; // Assume 6 decimal places for USDC

const bigIntToFloat = (value: bigint): number => {
  return Number(value) / 10 ** DECIMALS;
};

type Trade = {
  usdc: string | null;
  created_at: string;
};

type PricePeriod = {
  chartPrices: number[];
  change: number;
};

type PriceHistoryData = {
  oneHour: PricePeriod;
  oneDay: PricePeriod;
  oneWeek: PricePeriod;
  oneMonth: PricePeriod;
  allTime: PricePeriod;
};

const calculatePricePeriod = (
  trades: Trade[],
  startDate: Date
): PricePeriod => {
  const filteredTrades = trades.filter(
    (trade) => new Date(trade.created_at) >= startDate
  );

  const prices = filteredTrades
    .filter((trade) => trade !== null && trade.usdc !== null)
    .map((trade) => bigIntToFloat(BigInt(trade.usdc as string)));

  console.log("prices", prices);
  let change = 0;
  if (prices.length >= 2) {
    const newestPrice = prices[prices.length - 1];
    const oldestPrice = prices[0];
    change = ((newestPrice - oldestPrice) / oldestPrice) * 100;
  }

  return {
    chartPrices: prices,
    change,
  };
};

const fetchAllPriceHistory = async (
  id: string | null | undefined
): Promise<PriceHistoryData | null> => {
  if (!id) return null;

  const { data: trades, error } = await supabase
    .from("Trades")
    .select("usdc, created_at")
    .eq("post_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }

  if (!trades || trades.length === 0) {
    const emptyPeriod = { chartPrices: [], change: 0 };
    return {
      oneHour: emptyPeriod,
      oneDay: emptyPeriod,
      oneWeek: emptyPeriod,
      oneMonth: emptyPeriod,
      allTime: emptyPeriod,
    };
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    oneHour: calculatePricePeriod(trades, oneHourAgo),
    oneDay: calculatePricePeriod(trades, oneDayAgo),
    oneWeek: calculatePricePeriod(trades, oneWeekAgo),
    oneMonth: calculatePricePeriod(trades, oneMonthAgo),
    allTime: calculatePricePeriod(trades, new Date(0)), // Beginning of time
  };
};

export const usePriceHistory = (id: string | null | undefined) => {
  return useQuery<PriceHistoryData | null, Error>({
    queryKey: ["price-history", id],
    queryFn: () => fetchAllPriceHistory(id),
  });
};
