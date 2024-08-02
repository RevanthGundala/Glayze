import { useQuery } from "@tanstack/react-query";
import type { EnrichedTweet } from "react-tweet";

const fetchTweet = async (url: string | null) => {
  const baseUrl = "https://glayze.app";
  try {
    if (!url) return null;
    const id = url.split("/").pop();
    if (!id) return null;
    const response = await fetch(`${baseUrl}/api/twitter/tweet/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch tweet");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    return null;
  }
};

export const useEmbeddedTweet = (url: string | null) => {
  return useQuery<EnrichedTweet | null, Error>({
    queryKey: ["tweet", url],
    queryFn: () => fetchTweet(url),
  });
};
