import * as Sharing from "expo-sharing";

export const convertUsdcToShares = (
  usdcAmount: number,
  price: number
): number => {
  return usdcAmount / price;
};

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const share = async (url: string | undefined | null): Promise<void> => {
  if (!url) return;
  const success = await Sharing.isAvailableAsync();
  if (!success) return;
  await Sharing.shareAsync(url);
};
