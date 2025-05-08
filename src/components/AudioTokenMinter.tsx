import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { sdk } from "@farcaster/frame-sdk";
import AudioRecorder from "./AudioRecorder";

// Define the FarcasterParams interface
interface FarcasterParams {
  fid: string | null;
  action: string | null;
}

// Clanker contract ABI for deploying tokens
const clankerAbi = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "initialSupply", type: "uint256" },
      { internalType: "uint24", name: "fee", type: "uint24" },
      { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      { internalType: "uint256", name: "lockAmount", type: "uint256" },
      { internalType: "uint256", name: "lockDuration", type: "uint256" },
    ],
    name: "deployToken",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "pool", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Clanker contract address on Base
const CLANKER_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual Clanker contract address

interface AudioTokenMinterProps {
  farcasterParams: FarcasterParams;
}

const AudioTokenMinter = ({ farcasterParams }: AudioTokenMinterProps) => {
  const { address } = useAccount();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  // State to track if we should auto-start recording (for Farcaster integration)
  const [autoStartRecording, setAutoStartRecording] = useState(false);

  // Handle Farcaster frame actions
  useEffect(() => {
    // If action is 'record', automatically start recording
    if (farcasterParams.action === 'record') {
      console.log("Farcaster record action detected");
      setAutoStartRecording(true);
    }
  }, [farcasterParams]);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    generateSummary();
  };

  // Simulate generating a summary from the audio
  // In a real app, you would send the audio to a speech-to-text API
  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, generate a random summary
      const summaries = [
        "Thoughts on blockchain technology",
        "Ideas for decentralized applications",
        "Reflections on web3 development",
        "Notes about crypto markets",
        "Feedback on user experience",
      ];
      
      const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
      setSummary(randomSummary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Error generating summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const mintToken = async () => {
    if (!address || !summary) return;
    
    setIsMinting(true);
    
    try {
      // Generate a token name and symbol based on the audio summary
      const tokenName = `Audio: ${summary}`;
      const tokenSymbol = summary
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 5);
      
      // Set default parameters for token deployment
      const initialSupply = BigInt(1000000) * BigInt(10**18); // 1 million tokens with 18 decimals
      const fee = 3000; // 0.3% fee tier
      const sqrtPriceX96 = BigInt("79228162514264337593543950336"); // Default price of 1:1
      const lockAmount = initialSupply / BigInt(10); // Lock 10% of supply
      const lockDuration = BigInt(60 * 60 * 24 * 30); // 30 days lock
      
      // Call the deployToken function on the Clanker contract
      const data = await writeContractAsync({
        abi: clankerAbi,
        address: CLANKER_CONTRACT_ADDRESS,
        functionName: "deployToken",
        args: [
          tokenName,
          tokenSymbol,
          initialSupply,
          fee,
          sqrtPriceX96,
          lockAmount,
          lockDuration
        ],
      });
      
      // In a real scenario, you would parse the transaction receipt to get the token address
      // For demo purposes, we'll generate a mock address
      const mockTokenAddress = `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      setTokenAddress(mockTokenAddress);
      setTokenSymbol(tokenSymbol);
      setMintSuccess(true);
      
      console.log("Token deployed:", data);
      
      // If this was initiated from a Farcaster frame, send a response
      if (farcasterParams.fid) {
        try {
          // Notify Farcaster about the token creation
          // Use composeCast to create a new cast with the token information
          sdk.actions.composeCast({
            text: `I just created an audio token! Symbol: ${tokenSymbol}, Address: ${mockTokenAddress}`,
            embeds: [window.location.href]
          });
        } catch (error) {
          console.error("Error posting to Farcaster:", error);
        }
      }
    } catch (error) {
      console.error("Error deploying token:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="audio-token-minter">
      <h2>Record Audio & Create Token</h2>
      
      {!audioBlob ? (
        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete} 
          autoStart={autoStartRecording}
        />
      ) : (
        <div className="recorded-audio-container">
          <h3>Your Recording</h3>
          <audio src={audioUrl || ""} controls />
          
          <div className="summary-section">
            <h3>Summary</h3>
            {isGeneratingSummary ? (
              <p>Generating summary...</p>
            ) : (
              <p>{summary}</p>
            )}
          </div>
          
          {!mintSuccess ? (
            <button 
              onClick={mintToken} 
              disabled={isMinting || isGeneratingSummary || !summary}
              className="mint-button"
            >
              {isMinting ? "Creating Token..." : "Create ERC-20 Token from Audio"}
            </button>
          ) : (
            <div className="mint-success">
              <h3>Token Created Successfully!</h3>
              <p>Token Address: {tokenAddress}</p>
              <p>Token Symbol: {tokenSymbol}</p>
              <p>Token Name: Audio: {summary}</p>
              <p className="token-info">Your token has been created on the Base network using Clanker!</p>
              <button 
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setSummary("");
                  setMintSuccess(false);
                  setTokenAddress(null);
                  setTokenSymbol(null);
                }}
                className="record-new-button"
              >
                Record New Audio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioTokenMinter;
