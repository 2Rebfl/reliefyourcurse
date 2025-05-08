# Audio Token Minter - Farcaster Mini App

A Farcaster mini app that allows users to record a 5-second audio clip and create an ERC-20 token using Clanker.

## Features

- Record audio clips up to 5 seconds long
- Automatically generate a summary of the audio content
- Create an ERC-20 token on Base using Clanker
- Automatically generate token name and symbol from audio summary
- Multiple wallet connection options (Farcaster and Coinbase Wallet)

## Technologies Used

- [Farcaster Frame SDK](https://miniapps.farcaster.xyz/docs/getting-started)
- [Clanker](https://clanker.gitbook.io/clanker-documentation) for ERC-20 token creation
- React + TypeScript
- Vite
- Wagmi for wallet connections
- Coinbase Wallet SDK for wallet integration
- Web Audio API for audio recording

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Farcaster account
- A compatible wallet (e.g., Metamask, Coinbase Wallet)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your wallet by clicking either "Connect with Farcaster" or "Connect Coinbase Wallet"
2. Click "Start Recording" to begin recording audio
3. Speak for up to 5 seconds (recording will automatically stop after 5 seconds)
4. Wait for the summary to be generated
5. Click "Create Token from Audio" to create an ERC-20 token based on your audio
6. Once created, you'll see the token address, symbol, and name

## Development Mode

In development mode, you can use the "Simulate Connected" button to test the app without connecting a real wallet.

## Deployment

The application has been prepared for deployment with production URLs configured. To deploy the mini app:

1. Build the app (already done):

```bash
npm run build
```

2. Deploy the contents of the `dist` folder to your hosting provider (Vercel recommended)
3. Verify that the Farcaster Frame integration works correctly using the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames)

For detailed deployment instructions, see the [DEPLOYMENT.md](./DEPLOYMENT.md) guide, which includes:

- Step-by-step instructions for deploying to Vercel, Netlify, or GitHub Pages
- Post-deployment verification steps
- Troubleshooting common issues
- Future enhancement recommendations

## Clanker Integration

The app uses Clanker to create ERC-20 tokens on the Base network. Clanker is a set of smart contracts that create token markets which reward token creators.

The app interacts with the Clanker contract using the `deployToken` function:

```solidity
function deployToken(
  string name,
  string symbol,
  uint256 initialSupply,
  uint24 fee,
  uint160 sqrtPriceX96,
  uint256 lockAmount,
  uint256 lockDuration
) external returns (address token, address pool);
```

To use the actual Clanker contract, update the `CLANKER_CONTRACT_ADDRESS` constant in `src/components/AudioTokenMinter.tsx`.

## License

MIT
