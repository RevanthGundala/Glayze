import { getTweet, type Tweet } from "react-tweet/api";

export async function GET(request: Request) {
  try {
    // Extract the tweet ID from the request, for example from query parameters
    const url = new URL(request.url);
    const tweetId = url.searchParams.get("id");

    if (!tweetId) {
      return Response.json({ error: "Tweet ID is required" }, { status: 400 });
    }

    // Call the async getTweet function
    const tweet: Tweet | undefined = await getTweet(tweetId);

    if (!tweet) {
      return Response.json({ error: "Tweet not found" }, { status: 404 });
    }

    console.log("tweet", tweet);

    // Return the tweet data
    return Response.json(tweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
