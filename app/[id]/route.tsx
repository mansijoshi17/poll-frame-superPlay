"use server";
/** @jsxImportSource frog/jsx */
import { NextRequest, NextResponse } from "next/server";
import { getConnectedAddressForUser } from "@/utils/fc";
import { getPoll, balanceOf } from "@/utils/mint";
import { PinataFDK } from "pinata-fdk";
import { getVotes } from "@/utils/mint";
import { ethers } from "ethers";

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
  const pollLink = req.nextUrl.pathname.split("/").pop(); // Extract the poll link from the URL
  const pollData: any = await getPoll(pollLink); // Retrieve the poll data based on the link

  if (pollData) {
    const dateString = pollData.endDate;
    const date = new Date(dateString);

    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const formattedTime = `${days}:${hours}:${minutes}:${seconds}`;

    await getVotes(pollData._id, 1);

    const frameMetadata = await fdk.getFrameMetadata({
      buttons: pollData.choices.map((choice: any) => ({
        label: choice.value,
        action: "post", // Embedding choice index
        target: `${process.env.BASE_URL}/${pollData._id}/${choice.id}`,
      })),

      image: {
        url: `https://via.placeholder.com/600x400/white/black?text=${pollData.title}%0A%0AEnding In : ${formattedTime}`,
      },
    });
    return new NextResponse(frameMetadata);
  } else {
    // Handle the case where the poll link is invalid or the poll does not exist
    return new NextResponse("Poll not found", { status: 404 });
  }
}
