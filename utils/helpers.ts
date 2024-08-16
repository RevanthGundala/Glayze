import * as Sharing from "expo-sharing";
import { supabase } from "./supabase";
import { TransactionReceipt, parseEventLogs } from "viem";
import { ABI } from "./constants";

export const share = async (url: string | undefined | null): Promise<void> => {
  try {
    if (!url) return;
    const success = await Sharing.isAvailableAsync();
    if (!success) return;
    await Sharing.shareAsync(url);
  } catch (error) {
    console.log(error);
  }
};

export const formatUSDC = (priceString: string | undefined | null): string => {
  if (!priceString) return "0.00";

  // Remove any non-digit characters
  const cleanedPriceString = priceString.replace(/\D/g, "");

  if (cleanedPriceString === "") return "0.00";

  try {
    const num = BigInt(cleanedPriceString);
    const wholePart = num / BigInt(10 ** 6);
    const fractionalPart = num % BigInt(10 ** 6);

    let result = wholePart.toString();
    let fraction = fractionalPart.toString().padStart(6, "0");

    if (wholePart === BigInt(0)) {
      // Value is less than 1, show more decimals
      // Remove trailing zeros
      fraction = fraction.replace(/0+$/, "");
      if (fraction.length > 0) {
        result = "0." + fraction;
      } else {
        result = "0";
      }
      // Ensure at least two decimal places
      if (result.split(".")[1]?.length === 1) {
        result += "0";
      }
    } else {
      // Value is 1 or greater, show exactly 2 decimals
      result += "." + fraction.slice(0, 2);
    }

    return result;
  } catch (error) {
    console.error("Error in formatUSDC:", error);
    console.error("Invalid input:", priceString);
    return "0.00"; // Return a default value in case of error
  }
};

export const parseUSDC = (formattedUSDC: string | null | undefined): string => {
  if (!formattedUSDC || formattedUSDC === "0") return "0";

  // Remove any commas that might be present in the formatted string
  formattedUSDC = formattedUSDC.replace(/,/g, "");

  const [wholePart, fractionalPart = ""] = formattedUSDC.split(".");

  // Pad or truncate fractional part to 6 digits
  const paddedFractionalPart = fractionalPart.padEnd(6, "0").slice(0, 6);

  // Combine whole and fractional parts
  const combined = wholePart + paddedFractionalPart;

  // Remove leading zeros
  const trimmed = combined.replace(/^0+/, "");

  // If the result is empty (all zeros), return "0"
  return trimmed || "0";
};

type CreateUserOptions = {
  xUserId: number | undefined | null;
  address: string | undefined | null;
  referralCode: string | undefined | null;
};

export const upsertUser = async (
  dynamicId: string | undefined | null,
  options?: CreateUserOptions
): Promise<void> => {
  try {
    if (!dynamicId) throw new Error("No dynamic id");

    const { error } = await supabase.from("Users").upsert({
      dynamic_id: dynamicId,
      x_user_id: options?.xUserId?.toString(), // Convert to string
      address: options?.address,
      referral_code: options?.referralCode,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (dynamicId: string | undefined | null) => {
  try {
    if (!dynamicId) throw new Error("No dynamic id");
    const { error } = await supabase
      .from("Users")
      .delete()
      .eq("dynamic_id", dynamicId);
    if (error) throw error;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addToSearchHistory = async (
  dynamicId: string | undefined | null,
  content: string
) => {
  try {
    if (!dynamicId) throw new Error("No dynamic id");
    const { error } = await supabase.from("Search").insert([
      {
        dynamic_id: dynamicId,
        content,
      },
    ]);
    if (error) throw error;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteSearchHistory = async (
  dynamicId: string | undefined | null
) => {
  try {
    if (!dynamicId) throw new Error("No dynamic id");
    const { error } = await supabase
      .from("Search")
      .delete()
      .eq("dynamic_id", dynamicId);
    if (error) throw new Error("Error clearing all alerts");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insertTrade = async (
  txReceipt: TransactionReceipt | undefined
) => {
  try {
    if (!txReceipt) throw new Error("No transaction receipt");
    console.log("Inserting trade...");
    const logs = parseEventLogs({
      abi: ABI,
      logs: txReceipt.logs,
    });
    const tradeEvent = logs.find((log) => log.eventName === "Trade");
    if (!tradeEvent) return;
    const { postId, trader, isBuy, aura, usdc, shares, newPrice, timestamp } =
      tradeEvent.args;
    const { error } = await supabase.from("Trades").insert({
      post_id: postId.toString(),
      trader,
      is_buy: isBuy,
      shares: shares.toString(),
      price: newPrice.toString(),
      aura: aura.toString(),
      usdc: usdc.toString(),
      created_at: new Date().toISOString(),
    });
    console.log("Trade inserted successfully");
    return error ? error : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
