import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function PUT(request: Request) {
  try {
    const { referee, referrer } = await request.json();
    if (!referee || !referrer) throw new Error("No referee or referrer found");
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("referee", referee)
      .eq("referrer", referrer);
    if (error) throw error;
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { referrer } = await request.json();
    if (!referrer) throw new Error("No referrer found");
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("show", true)
      .eq("referrer", referrer);
    if (error) throw error;
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}
