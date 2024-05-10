"use server";
import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import contractAbi from "./contract.json";
import axios from "axios";
import { publicClient } from "./publicClient";

const contractAddress = process.env.CONTRACT_ADDRESS as `0x`;

const account = privateKeyToAccount(
  (process.env.NEXT_APP_PRIVATE_KEY as `0x`) || ""
);

interface PollData {
  title: string;
  choices: string[];
}

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

export async function getPoll(pollId: string | undefined) {
  try {
    var poll;
    await axios
      .get(`https://frame-backend-z2b9.onrender.com/polls/${pollId}`)
      .then((res) => {
        poll = res.data.data;
      });
    return poll;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function CreatePoll(
  name: string,
  numOfChoice: number,
  pollId: string
) {
  try {
    console.log(typeof pollId, "pollId in MINT TS");
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "createPoll",
      args: [name, numOfChoice, pollId],
    });
    const transaction = await walletClient.writeContract(request);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function Vote(pollId: string, choice: number) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "vote",
      args: [pollId, choice],
    });
    const transaction = await walletClient.writeContract(request);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// export async function BetAgainstPrediction(amount: bigint) {
//   try {
//     const { request }: any = await publicClient.simulateContract({
//       account,
//       address: contractAddress,
//       abi: contractAbi,
//       functionName: "betAgainst",
//       args: [amount],
//     });
//     const transaction = await walletClient.writeContract(request);
//     return transaction;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

export async function mintNft(toAddress: string) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "mint",
      args: [toAddress, 0, 1, `0x`],
    });
    const transaction = await walletClient.writeContract(request);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function balanceOf(address: string) {
  try {
    const balanceData = await publicClient.readContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "getBalance",
      args: [address],
    });
    const balance: number = Number(balanceData);
    return balance;
  } catch (error) {
    console.log(error);
    return error;
  }
}
