import { readFileSync } from "fs";

interface RequestData {
  tokenId: string;
  name: string;
  symbol: string;
  image: string;
}

export async function POST(request: Request) {
  try {
    const requestData: RequestData = await request.json();
    console.log("Received data:", requestData);

    const imageIpfsHash = await uploadImageToPinata(requestData);

    if (!imageIpfsHash)
      return new Response(JSON.stringify({ error: "Failed to upload image" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    const metadataIpfsHash = await uploadMetadataToPinata(
      requestData,
      imageIpfsHash
    );
    console.log(metadataIpfsHash);
    if (!metadataIpfsHash)
      return new Response(
        JSON.stringify({ error: "Failed to upload metadata" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );

    return new Response(JSON.stringify({ metadataIpfsHash }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function uploadImageToPinata({
  image,
  tokenId,
}: RequestData): Promise<string | null> {
  try {
    const JWT = process.env.PINATA_JWT!;
    let buffer;

    if (image.startsWith("https://")) {
      const urlStream = await fetch(image);
      buffer = await urlStream.arrayBuffer();
    } else {
      buffer = readFileSync(image);
    }

    const blob = new Blob([buffer]);
    const file = new File([blob], "file");
    const formData = new FormData();
    formData.append("file", file, `Image for ${tokenId}`);

    const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    });

    const data = await res.json();
    return data.IpfsHash;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function uploadMetadataToPinata(
  { tokenId, symbol, name }: RequestData,
  imageIpfsHash: string
): Promise<string | null> {
  try {
    const JWT = process.env.PINATA_JWT!;
    const gateway = "green-entitled-bovid-242.mypinata.cloud";
    const metadata = {
      name,
      description: symbol,
      image: `ipfs://${imageIpfsHash}`,
      external_url: "https://glayze.app",
      attributes: [{ trait_type: "Token ID", value: tokenId }],
    };

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const file = new File([blob], `Metadata for ${symbol}`);
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    });

    const data = await res.json();
    return data.IpfsHash;
  } catch (e) {
    console.error(e);
    return null;
  }
}
