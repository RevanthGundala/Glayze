import { TransactionReceipt, parseEventLogs } from "viem";
import { ABI } from "./constants";

export const getUser = async (privyId: string | undefined | null) => {
  try {
    const res = await fetch(`/api/supabase/users?privyId=${privyId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type CreateUserOptions = {
  xUserId?: string | undefined | null;
  address?: string | undefined | null;
  referralCode?: string | undefined | null;
};

export const upsertUser = async (
  privyId: string | undefined | null,
  options?: CreateUserOptions
) => {
  try {
    const res = await fetch(`/api/supabase/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privyId,
        options,
      }),
    });
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
};

export const deleteUser = async (privyId: string | undefined | null) => {
  try {
    const res = await fetch(`/api/supabase/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privyId,
      }),
    });
    if (res.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addToSearchHistory = async (
  privyId: string | undefined | null,
  content: string
) => {
  try {
    const res = await fetch(`/api/supabase/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privyId,
        content,
      }),
    });
    if (res.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteSearchHistory = async (
  privyId: string | undefined | null
) => {
  try {
    const res = await fetch(`/api/supabase/search`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privyId,
      }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const insertTrade = async (
  txReceipt: TransactionReceipt | undefined
) => {
  try {
    if (!txReceipt) throw new Error("No transaction receipt provided");
    const logs = parseEventLogs({
      abi: ABI,
      logs: txReceipt.logs,
    });
    const tradeEvent = logs.find((log) => log.eventName === "Trade");
    const tradeFeesEvent = logs.find((log) => log.eventName === "TradeFees");
    if (!tradeEvent || !tradeFeesEvent) throw new Error("No trade event");
    const {
      postId,
      trader,
      isBuy,
      aura,
      usdc,
      shares,
      price,
      supply,
      timestamp,
    } = tradeEvent.args;
    const { usdc: fees } = tradeFeesEvent.args;
    const res = await fetch(`/api/supabase/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId.toString(),
        trader,
        isBuy,
        aura: aura.toString(),
        usdc: usdc.toString(),
        shares: shares.toString(),
        price: price.toString(),
        supply: supply.toString(),
        fees: fees.toString(),
        created_at: new Date().toISOString(),
      }),
    });
    if (res.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const insertPost = async (
  postId: string | null | undefined,
  name: string | null | undefined,
  symbol: string | null | undefined,
  metadataIpfsHash: string | null | undefined,
  url: string | undefined | null,
  realCreator: string | undefined | null,
  imageIpfsHash: string | undefined | null,
  contractCreator: string | undefined | null
) => {
  try {
    const response = await fetch("/api/supabase/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        name,
        symbol,
        url,
        contractCreator,
        realCreator,
        imageIpfsHash,
        metadataIpfsHash,
      }),
    });
    if (response.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const insertReferral = async (
  referrer: string | undefined | null,
  referee: string | undefined | null
) => {
  try {
    const response = await fetch("/api/supabase/referrals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referrer,
        referee,
      }),
    });
    if (response.status !== 200) {
      throw new Error("Failed to create post in Supabase.");
    }
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};
