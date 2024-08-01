export const convertUsdcToShares = (
  usdcAmount: number,
  price: number
): number => {
  return usdcAmount / price;
};
