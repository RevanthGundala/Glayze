import { walletClient, publicClient } from "./config";
import abi from "../abi.json";
import { Address } from "viem";
import { data, Input } from "./config";
import { supabase } from "@/utils/supabase";
import { ABI } from "@/utils/constants";

const main = async (inputArray: Input[]) => {
  for (const input of inputArray) {
    const { postId, name, symbol, url, image } = input;
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/ipfs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          postId,
          name,
          symbol,
          image,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to upload metadata to IPFS: ${
          errorData ? JSON.stringify(errorData) : response.statusText
        }`
      );
    }

    const { metadataIpfsHash, imageIpfsHash } = await response.json();
    console.log("Metadata IPFS Hash:", metadataIpfsHash);

    const txHash = await walletClient.writeContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
      abi: ABI,
      functionName: "createPost",
      args: [BigInt(postId), name, symbol, metadataIpfsHash],
    });
    console.log("✅ Transaction successfully sponsored!");
    console.log(
      `🔍 View on Etherscan: https://sepolia.basescan.org/tx/${txHash}`
    );
    const { error } = await supabase.from("Posts").insert([
      {
        post_id: parseInt(postId),
        name,
        symbol,
        url,
        contract_creator: walletClient.account.address,
        image_uri: imageIpfsHash,
        volume: 0,
        ath: 0,
      },
    ]);
    if (error) {
      throw new Error("Failed to create post in Supabase.");
    }
  }
};

main(data).then(console.log("Done!")).catch(console.error);
