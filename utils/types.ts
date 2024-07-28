import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];
export type Post = Tables["Posts"]["Row"];
export type User = Tables["Users"]["Row"];
export type Trade = Tables["Trades"]["Row"];
export type Referral = Tables["Referrals"]["Row"];
export type Search = Tables["Search"]["Row"];

export type Route = {
  name: string;
  href: string;
};

export type Time = "LIVE" | "1H" | "1D" | "1W" | "1M" | "ALL";
