import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referee = searchParams.get("referee");

    if (!referee) {
      throw new Error("No referee provided");
    }

    const { data, error } = await supabase
      .from("Referrals")
      .select("*")
      .eq("referee", referee)
      .eq("show", true);

    if (error) {
      throw new Error(`Error fetching referrals: ${error.message}`);
    }

    return Response.json({ data, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while fetching referrals.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { referee, referrer } = await request.json();

    if (!referrer || !referee) {
      throw new Error("Referral address and address are required");
    }

    const { error } = await supabase.from("Referrals").insert([
      {
        referrer,
        referee,
        show: true,
        pending: true,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw new Error(
        `Failed to create referral in Supabase: ${error.message}`
      );
    }

    return Response.json({
      status: 200,
      message: "Referral created successfully",
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while creating the referral.",
      status: 500,
    });
  }
}
