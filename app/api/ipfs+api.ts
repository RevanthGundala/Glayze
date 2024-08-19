interface RequestData {
  postId: string;
  name: string;
  symbol: string;
  image: string;
}

export async function POST(request: Request) {
  try {
    const requestData: RequestData = await request.json();
    console.log("Received data:", requestData);

    console.log("Attempting to upload image to Pinata...");
    const imageIpfsHash = await uploadImageToPinata(requestData);
    console.log("Image upload result:", imageIpfsHash);

    if (!imageIpfsHash) {
      console.error("Failed to upload image");
      return Response.json(
        { error: "Failed to upload image" },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Attempting to upload metadata to Pinata...");
    const metadataIpfsHash = await uploadMetadataToPinata(
      requestData,
      imageIpfsHash
    );
    console.log("Metadata upload result:", metadataIpfsHash);

    if (!metadataIpfsHash) {
      console.error("Failed to upload metadata");
      return Response.json(
        { error: "Failed to upload metadata" },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return Response.json(
      { metadataIpfsHash, imageIpfsHash },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "An error occurred" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function uploadImageToPinata({
  image,
  postId,
}: RequestData): Promise<string | null> {
  try {
    console.log("Starting uploadImageToPinata");
    const JWT = process.env.PINATA_JWT!;
    console.log("JWT available:", !!JWT);
    let buffer;

    if (image.startsWith("https://")) {
      console.log("Fetching image from URL");
      const urlStream = await fetch(image);
      buffer = await urlStream.arrayBuffer();
    } else {
      console.log("Processing base64 image");
      const base64Data = image.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");
    }

    console.log("Creating Blob and File");
    const blob = new Blob([buffer]);
    const file = new File([blob], "file");
    const formData = new FormData();
    formData.append("file", file, `Image for ${postId}`);

    console.log("Sending request to Pinata");
    const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    });

    console.log("Pinata response status:", res.status);
    const data = await res.json();
    console.log("Pinata response data:", data);

    return data.IpfsHash;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function uploadMetadataToPinata(
  { postId, symbol, name }: RequestData,
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
      attributes: [{ trait_type: "Token ID", value: postId }],
    };

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const file = new File([blob], `Metadata for ${postId}`);
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
