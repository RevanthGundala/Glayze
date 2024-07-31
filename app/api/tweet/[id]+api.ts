import { getTweet, type Tweet } from "react-tweet/api";
import { enrichTweet } from "react-tweet";

export async function GET(request: Request, { id }: { id: string }) {
  console.log("Apo route");
  try {
    if (!id) {
      return Response.json({ error: "Tweet ID is required" }, { status: 400 });
    }

    const tweet: Tweet | undefined = await getTweet(id);

    if (!tweet) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }

    const enrichedTweet = enrichTweet(tweet);

    return Response.json(enrichedTweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
