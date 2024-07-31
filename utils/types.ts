import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];
export type Post = Tables["Posts"]["Row"];
export type User = Tables["Users"]["Row"];
export type Trade = Tables["Trades"]["Row"];
export type Referral = Tables["Referrals"]["Row"];
export type Search = Tables["Search"]["Row"];

export type Position = {
  tokens: number;
  totalValueInvested: number;
  marketValue: number;
  averageCost: number;
  todaysReturn: number;
  todaysReturnPercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  currentPrice: number;
  firstBought: Date;
};

export type Route = {
  name: string;
  href: string;
};

export type Time = "1H" | "1D" | "1W" | "1M" | "ALL";
