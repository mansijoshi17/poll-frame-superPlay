"use client";
import PollCreator from "./component/Poll";
import { Login } from "./component/SignIn";
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider } from "@farcaster/auth-kit";

const config = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "example.com",
  siweUri: "https://example.com/login",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AuthKitProvider config={config}>
        {/* <Login /> */}

        <PollCreator />
      </AuthKitProvider>
    </main>
  );
}
