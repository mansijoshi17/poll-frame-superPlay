import { NextRequest, NextResponse } from "next/server";
import { getConnectedAddressForUser } from "@/utils/fc";
import { getPoll, balanceOf } from "@/utils/mint";
import { PinataFDK } from "pinata-fdk";
import { BetForPrediction, BetAgainstPrediction } from "@/utils/mint";
import { ethers } from "ethers";
import { handle } from 'frog/vercel'

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

    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/${pollData._id}`,
      buttons: pollData.choices.map((choice: any) => ({
        label: choice.value,
        action: "post",
      })),
      image: {
        url: `https://placehold.co/500x500/white/black?text=${pollData.title}%0AEnding In : ${formattedTime}`,
      },
      
    });
    return new NextResponse(frameMetadata);
  } else {
    // Handle the case where the poll link is invalid or the poll does not exist
    return new NextResponse("Poll not found", { status: 404 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const pollLink = req.nextUrl.pathname.split("/").pop(); // Extract the poll link from the URL
  const pollData: any = await getPoll(pollLink); // Retrieve the poll data based on the link

  const fid = pollData.fid;
  const address = await getConnectedAddressForUser(fid);

  const balance = await balanceOf(address);

  if (typeof balance === "number" && balance !== null && balance > 0) {
    try {
      const Bet = await BetForPrediction(ethers.parseUnits("0.001", "ether"));
      console.log(Bet);
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
  } else {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: [
        {
          label: `${typeof balance}`,
          action: "post_redirect",
        },
      ],
      image: {
        url: "https://bafybeia6w3skqj5uhgfvnma22ycprlyznpthj52eo5x5gflkg4i7meenuy.ipfs.dweb.link/",
      },
    });
    return new NextResponse(frameMetadata);
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
