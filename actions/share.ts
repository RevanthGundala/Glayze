import * as Sharing from "expo-sharing";

export const share = async (url: string | undefined | null) => {
  if (!url) return;
  const success = await Sharing.isAvailableAsync();
  if (!success) return;
  await Sharing.shareAsync(url);
};
