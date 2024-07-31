import type {
  MediaDetails,
  MediaAnimatedGif,
  MediaVideo,
} from "react-tweet/api";

export const getMediaUrl = (
  media: MediaDetails,
  size: "small" | "medium" | "large"
): string => {
  const url = new URL(media.media_url_https);
  const extension = url.pathname.split(".").pop();

  if (!extension) return media.media_url_https;

  url.pathname = url.pathname.replace(`.${extension}`, "");
  url.searchParams.set("format", extension);
  url.searchParams.set("name", size);

  return url.toString();
};

export const getMp4Videos = (media: MediaAnimatedGif | MediaVideo) => {
  const { variants } = media.video_info;
  const sortedMp4Videos = variants
    .filter((vid) => vid.content_type === "video/mp4")
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  return sortedMp4Videos;
};

export const getMp4Video = (media: MediaAnimatedGif | MediaVideo) => {
  const mp4Videos = getMp4Videos(media);
  // Skip the highest quality video and use the next quality
  return mp4Videos.length > 1 ? mp4Videos[1] : mp4Videos[0];
};

export const formatNumber = (n: number): string => {
  if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
  if (n > 999) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};
