"use server";
import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import contractAbi from "./contract.json";
import axios from "axios";
import { publicClient } from "./publicClient";
import { ethers } from "ethers";

const contractAddress = process.env.CONTRACT_ADDRESS as `0x`;

interface PollData {
  title: string;
  choices: string[];
}

const provider = new ethers.JsonRpcProvider(`${process.env.ALCHEMY_URL}`);
const signer = new ethers.Wallet(
  process.env.NEXT_APP_PRIVATE_KEY as `0x`,
  provider
);
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

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
    const transaction = await contract.createPoll(name, numOfChoice, pollId);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getVotes(pollId: string) {
  try {
    const votes = await contract.getVotes(pollId);
    const pollVotes = await votes.map((vote: any) => vote.toString());
    return pollVotes;
  } catch (error) {
    console.log(error);
    return error;
  }
}
