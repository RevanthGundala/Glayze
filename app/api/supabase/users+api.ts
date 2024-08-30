import { createClient } from "@supabase/supabase-js";
import { PrivyClient } from "@privy-io/server-auth";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const privyId = searchParams.get("privyId");
    const xUserId = searchParams.get("xUserId");

    if (privyId) {
      return getUserByPrivyId(privyId);
    } else if (xUserId) {
      return getUserAddressByXUserId(xUserId);
    } else {
      throw new Error("No privyId or xUserId provided");
    }
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while fetching user data.",
      status: 500,
    });
  }
}

async function getUserByPrivyId(privyId: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("privy_id", privyId)
    .single();

  if (!data || error) {
    throw new Error(`Error fetching user: ${error?.message}`);
  }

  return Response.json({ data, status: 200 });
}

async function getUserAddressByXUserId(xUserId: string) {
  const { data, error } = await supabase
    .from("Users")
    .select("address")
    .eq("x_user_id", xUserId)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching X address: ${error?.message}`);
  }

  return Response.json({ data: data?.address ?? null, status: 200 });
}

export async function POST(request: Request) {
  try {
    const { privyId, options } = await request.json();
    if (!privyId) throw new Error("No dynamic id");

    const upsertData: any = {
      privy_id: privyId,
      created_at: new Date().toISOString(),
    };

    if (options?.xUserId) {
      upsertData.x_user_id = options.xUserId.toString();
    }

    if (options?.address) {
      upsertData.address = options.address.toString();
    }

    if (options?.referralCode) {
      upsertData.referral_code = options.referralCode.toString();
    }

    const { error } = await supabase.from("Users").upsert(upsertData);
    if (error) throw error;
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { privyId } = await request.json();
    if (!privyId) throw new Error("No privy id");
    const privy = new PrivyClient(
      process.env.EXPO_PUBLIC_PRIVY_APP_ID,
      process.env.PRIVY_APP_SECRET
    );

    await privy.deleteUser(privyId);
    const { error } = await supabase
      .from("Users")
      .delete()
      .eq("privy_id", privyId);
    if (error) throw error;
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Unlink X account
    const { privyId } = await request.json();
    if (!privyId) throw new Error("No privy id");
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("privy_id", privyId)
      .single();

    if (!data || error) {
      throw new Error(`Error fetching user: ${error?.message}`);
    }

    const { error: unlinkError } = await supabase
      .from("Users")
      .update({
        x_user_id: null,
      })
      .eq("privy_id", privyId);

    if (unlinkError) throw unlinkError;

    const response = await fetch(
      `https://api.privy.io/v1/apps/${process.env.EXPO_PUBLIC_PRIVY_APP_ID}/users/unlink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.EXPO_PUBLIC_PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`
          ).toString("base64")}`,
          "privy-app-id": process.env.EXPO_PUBLIC_PRIVY_APP_ID,
        },
        body: JSON.stringify({
          user_id: privyId,
          type: "twitter_oauth",
          handle: data.x_user_id,
        }),
      }
    );
    if (!response.ok) throw new Error("Failed to unlink user");
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}
