import { useQuery } from "@tanstack/react-query";

const DECIMALS = 6; // Assume 6 decimal places for USDC

const bigIntToFloat = (value: bigint): number => {
  return Number(value) / 10 ** DECIMALS;
};

type Trade = {
  price: string | null;
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
    .filter((trade) => trade !== null && trade.price !== null)
    .map((trade) => bigIntToFloat(BigInt(trade.price as string)));

  console.log("prices", prices);
  let change = 0;
  if (prices.length >= 2) {
    const oldestPrice = prices[prices.length - 1];
    const newestPrice = prices[0];

    if (oldestPrice === 0) {
      // Handle the case where the oldest price is 0
      if (newestPrice === 0) {
        change = 0; // Both prices are 0, no change
      } else {
        change = ((newestPrice - 0.000001) / 0.000001) * 100; // newestPrice is not 0, change is negative
      }
    } else {
      change = ((newestPrice - oldestPrice) / oldestPrice) * 100;
    }
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
  let trades: any[] = [];

  try {
    const response = await fetch(
      `/api/supabase/trades?action=getTradesPriceHistory&id=${id}`
    );
    const data = await response.json();
    trades = data.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching trades`);
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
