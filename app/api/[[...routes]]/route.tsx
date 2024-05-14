"use server";
/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import { getPoll, getVotes } from "@/utils/mint";
import contractAbi from "../../../utils/contract.json";

const app = new Frog({
  basePath: "/api",
});

async function generatePlaceholderURL(pollData: any, votes: any) {
  const title = encodeURIComponent(pollData.title);
  let text = `${title}%0A`;

  text += `Total%20Votes%0A`;

  // Append each choice and its votes
  pollData.choices.forEach((choice: any, index: number) => {
    if (votes[index] == undefined) {
      text += `${encodeURIComponent(choice.value)}:%20${0}%0A`;
    } else {
      text += `${encodeURIComponent(choice.value)}:%20${votes[index]}%0A`;
    }
  });

  // Construct the final URL
  return `https://via.placeholder.com/700x500/white/black?text=${text}`;
}

app.frame("/poll/:id", async (c) => {
  const id = c.req.param("id");
  const pollData: any = await getPoll(id); // Retrieve the poll data based on the link
  var formattedTime;

  if (pollData) {
    const dateString = pollData.endDate;
    const date = new Date(dateString);

    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    formattedTime = `${days}:${hours}:${minutes}:${seconds}`;
  }
  return c.res({
    action: `/voted/${pollData._id}`,
    image: `https://via.placeholder.com/600x400/white/black?text=${pollData.title}%0A%0AEnding In : ${formattedTime}`,
    intents: pollData.choices.map((choice: any) => {
      return (
        <Button.Transaction target={`/vote/${pollData._id}/${choice.id}`}>
          {choice.value}
        </Button.Transaction>
      );
    }),
  });
});

app.transaction("/vote/:pollId/:choice", async (c) => {
  const pollId = c.req.param("pollId");
  const choice = c.req.param("choice");
  const pollData: any = await getPoll(pollId); // Retrieve the poll data based on the link
  const fid = pollData.fid;
  return c.contract({
    abi: contractAbi,
    chainId: "eip155:84532",
    functionName: "vote",
    to: process.env.CONTRACT_ADDRESS as "0x",
    args: [pollId, choice],
  });
});

app.frame("/voted/:id", async (c) => {
  const pollId = c.req.param("id");
  const pollData: any = await getPoll(pollId); // Retrieve the poll data based on the link
  let votes: any = await getVotes(pollId);
  let url = await generatePlaceholderURL(pollData, votes);

  return c.res({
    image: url,
  });
});

export const GET = handle(app);
export const POST = handle(app);
