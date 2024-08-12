import * as Sharing from "expo-sharing";
import { supabase } from "./supabase";

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
      x_user_id: options?.xUserId,
      address: options?.address,
      referral_code: options?.referralCode,
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
