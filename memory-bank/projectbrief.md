# Audio Token Minter - Project Brief

## Project Overview

The Audio Token Minter is a Farcaster mini app that allows users to record short audio clips (5 seconds) and mint them as tokens on the blockchain. The app provides a simple interface for recording audio, automatically generates a summary of the content, and allows users to mint the audio as a token.

## Core Requirements

1. **Audio Recording**: Users should be able to record audio clips up to 5 seconds in length.
2. **Automatic Summarization**: The app should generate a summary of the audio content (simulated in the current implementation).
3. **Token Minting**: Users should be able to mint their audio recordings as tokens on the blockchain.
4. **Wallet Integration**: The app should integrate with the user's wallet through the Farcaster Frame SDK.

## Technical Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Wallet Integration**: Wagmi + Farcaster Frame SDK
- **Audio Recording**: Web Audio API
- **Styling**: CSS

## User Flow

1. User connects their wallet
2. User records a 5-second audio clip
3. App generates a summary of the audio content
4. User mints the audio as a token
5. User sees confirmation of the minted token

## Future Enhancements

1. **Audio Storage**: Store audio files on IPFS or another decentralized storage solution
2. **Real Summarization**: Integrate with a speech-to-text API to generate real summaries
3. **Token Gallery**: Allow users to view all their minted tokens
4. **Social Sharing**: Enable sharing of minted tokens on Farcaster
5. **Custom Token Metadata**: Allow users to customize the metadata of their tokens

## Development Notes

- The current implementation uses a mock NFT contract address. In a production environment, this should be replaced with a real contract address.
- The summarization is currently simulated. In a production environment, this should be replaced with a real speech-to-text API.
- The app includes a development mode that allows testing without connecting a real wallet.
