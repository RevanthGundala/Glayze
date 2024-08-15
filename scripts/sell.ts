import { walletClient, publicClient, TransactionInput } from "./config";
import abi from "../abi.json";
import { Address } from "viem";

async function main(inputArray: TransactionInput[]) {
  for (const input of inputArray) {
    const { postId, shares } = input;
    const hash = await walletClient.writeContract({
      address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
      abi,
      functionName: "sellShares",
      args: [postId, shares, 0],
    });
    const txReceipt = await publicClient.getTransactionReceipt({ hash });
    console.log(txReceipt);
  }
}

main(data)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
