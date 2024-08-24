import { TransactionReceipt } from "viem";

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
    const res = await fetch(`/api/supabase/user`, {
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
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insertTrade = async (
  txReceipt: TransactionReceipt | undefined
) => {
  try {
    const res = await fetch(`/api/supabase/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txReceipt,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    const response = await fetch("/api/supabase/posts", {
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
