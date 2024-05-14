'use server';
/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";

const app = new Frog({
  basePath: "/api",
});

app.frame("/", (c) => {
  console.log("I am in");
  return c.res({
    image: "https://via.placeholder.com/600x400/white/black?text=Hey",
    intents: [
      <Button value="apple">Apple</Button>,
      <Button value="banana">Banana</Button>,
      <Button value="mango">Mango</Button>,
    ],
  });
});

export const GET = handle(app);
