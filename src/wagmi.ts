import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { coinbaseWallet } from "@wagmi/connectors";

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    farcasterFrame(),
    coinbaseWallet({
      appName: "Audio Token Minter",
      appLogoUrl: "https://example.com/logo.png", // Replace with your app logo
    }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
