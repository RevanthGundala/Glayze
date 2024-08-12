import { walletClient, publicClient } from "./config";
import abi from "../abi.json";
import { Address } from "viem";

async function main() {
  const hash = await walletClient.writeContract({
    address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
    abi,
    functionName: "buyShares",
    args: [
      0,
      "Hello World",
      "This is a test post",
      "ipfs://bafybeic7d7i4i7e7a4qiu6w2ia7iq3a3oj4r6u4l2n4m2s2e",
    ],
  });
  const txReceipt = await publicClient.getTransactionReceipt({ hash });
  console.log(txReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
