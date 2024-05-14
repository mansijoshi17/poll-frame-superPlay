"use server";
/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import { getPoll, Vote } from "@/utils/mint";
import contractAbi from "../../../utils/contract.json";

const app = new Frog({
  basePath: "/api",
});

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
    action: "/voted",
    image: `https://via.placeholder.com/600x400/white/black?text=${pollData.title}%0A%0AEnding In : ${formattedTime}`,
    intents: pollData.choices.map((choice: any) => {
      return (
        <Button value={choice.id} action={`/vote/${pollData._id}/${choice.id}`}>
          {choice.value}
        </Button>
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

app.frame("/voted", (c) => {
  return c.res({
    browserLocation: "https://cointopper.com/",
    image:
      "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/",
    intents: (
      <Button action="https://cointopper.com/">
        Want to learn more about crypto?
      </Button>
    ),
  });
});

export const GET = handle(app);
