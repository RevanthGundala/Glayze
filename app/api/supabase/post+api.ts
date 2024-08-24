import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let query = supabase.from("Posts").select("*");

    if (id) {
      const { data, error } = await query.eq("post_id", id).single();
      if (error) throw error;
      return Response.json({ data, status: 200 });
    } else {
      const { data, error } = await query;
      if (error) throw error;
      return Response.json({ data, status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while fetching posts.",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const {
      postId,
      name,
      symbol,
      url,
      contractCreator,
      realCreator,
      imageIpfsHash,
      metadataIpfsHash,
    } = await request.json();

    if (!postId) {
      throw new Error("No post ID provided");
    }

    const { error } = await supabase.from("Posts").insert([
      {
        post_id: postId,
        name,
        symbol,
        url,
        contract_creator: contractCreator,
        real_creator: realCreator,
        image_uri: imageIpfsHash,
        post_uri: metadataIpfsHash,
      },
    ]);

    if (error) {
      throw new Error("Failed to create post in Supabase.");
    }

    return Response.json({ status: 200, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({
      error: "An error occurred while creating the post.",
      status: 500,
    });
  }
}
