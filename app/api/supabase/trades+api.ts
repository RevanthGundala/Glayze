import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "getTradesByPostAndTrader") {
      return getTradesByPostAndTrader(request);
    } else if (action === "getTradesPriceHistory") {
      return getTradesPriceHistory(request);
    } else {
      throw new Error("Invalid action specified");
    }
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while processing the request.",
      status: 500,
    });
  }
}

async function getTradesByPostAndTrader(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const address = searchParams.get("address");

  if (!postId || !address) {
    throw new Error("Missing postId or address in request body");
  }

  const { data, error } = await supabase
    .from("Trades")
    .select("usdc, shares, fees, created_at, is_buy")
    .eq("post_id", postId)
    .eq("trader", address);

  if (error) {
    throw error;
  }

  return Response.json({ data, status: 200 });
}

async function getTradesPriceHistory(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new Error("Missing post id in request body");
  }

  const { data, error } = await supabase
    .from("Trades")
    .select("price, created_at")
    .eq("post_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }

  return Response.json({ data, status: 200 });
}

export async function POST(request: Request) {
  try {
    const {
      postId,
      trader,
      isBuy,
      aura,
      usdc,
      shares,
      price,
      supply,
      fees,
      created_at,
    } = await request.json();
    console.log("Inserting trade...");

    const { error } = await supabase.from("Trades").insert({
      post_id: postId,
      trader,
      is_buy: isBuy,
      shares,
      aura,
      usdc,
      price,
      supply,
      fees,
      created_at,
    });
    console.log("Trade inserted successfully");
    if (error) throw error;
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}
