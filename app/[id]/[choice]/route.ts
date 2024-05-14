"use server";
import { NextRequest, NextResponse } from "next/server";
import { getConnectedAddressForUser } from "@/utils/fc";
import { getPoll, balanceOf } from "@/utils/mint";
import { PinataFDK } from "pinata-fdk";
import { Vote } from "@/utils/mint";
import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import contractAbi from "../../../utils/contract.json";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

const app = new Frog({
  basePath: "/",
});

export async function POST(req: NextRequest, res: NextResponse) {
  // const pollLink = req.nextUrl.pathname.split("/").pop(); // Extract the poll link from the URL

  const parts = req.nextUrl.pathname.split("/");
  const pollId = parts[parts.length - 2];
  const choiceVal = parseInt(parts[parts.length - 1]);

  const pollData: any = await getPoll(pollId); // Retrieve the poll data based on the link

  const fid = pollData.fid;
  const address = await getConnectedAddressForUser(fid);

  // const balance = await balanceOf(address);
  try {
    const vote = await Vote(pollId, choiceVal);
    console.log(vote);
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: [
        {
          label: "Want to learn more about crypto?",
          action: "post_redirect",
        },
      ],
      image: {
        url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/",
      },
    });

    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }

  // else {
  //   const frameMetadata = await fdk.getFrameMetadata({
  //     post_url: `${process.env.BASE_URL}/redirect`,
  //     buttons: [
  //       {
  //         label: "Want to learn more about crypto?",
  //         action: "post_redirect",
  //       },
  //     ],
  //     image: {
  //       url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/",
  //     },
  //   });

  //   return new NextResponse(frameMetadata);
  // }
}

