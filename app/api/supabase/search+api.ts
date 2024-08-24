import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const privyId = searchParams.get("privyId");

    if (!privyId) {
      throw new Error("No privy_id provided");
    }

    const { data, error } = await supabase
      .from("Search")
      .select("content")
      .eq("privy_id", privyId);

    if (error) throw error;

    return Response.json({ data, status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while fetching search records.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { privyId, content } = await request.json();
    if (!privyId) throw new Error("No dynamic id");
    const { error } = await supabase.from("Search").insert([
      {
        privy_id: privyId,
        content,
      },
    ]);
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
    if (!privyId) throw new Error("No dynamic id");
    const { error } = await supabase
      .from("Search")
      .delete()
      .eq("privy_id", privyId);
    if (error) throw new Error("Error clearing search history");
    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error, status: 500 });
  }
}
