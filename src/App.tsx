import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState, useCallback } from "react";
import { useAccount, useConnect } from "wagmi";
import AudioTokenMinter from "./components/AudioTokenMinter";
import TokenList from "./components/TokenList";

interface FarcasterParams {
  fid: string | null;
  action: string | null;
}

// Mock token data for the view tokens feature
const mockTokens = [
  {
    id: 1,
    name: "Audio: Thoughts on blockchain technology",
    symbol: "TOBT",
    address: "0x1234567890123456789012345678901234567890",
    createdAt: "2025-05-08T12:00:00Z"
  },
  {
    id: 2,
    name: "Audio: Ideas for decentralized applications",
    symbol: "IFDA",
    address: "0x2345678901234567890123456789012345678901",
    createdAt: "2025-05-07T14:30:00Z"
  },
  {
    id: 3,
    name: "Audio: Reflections on web3 development",
    symbol: "ROWD",
    address: "0x3456789012345678901234567890123456789012",
    createdAt: "2025-05-06T09:15:00Z"
  }
];

function App() {
  // For testing purposes - simulate connected/disconnected state
  const [simulateConnected, setSimulateConnected] = useState(false);
  
  // Extract Farcaster parameters from URL
  const [farcasterParams, setFarcasterParams] = useState<FarcasterParams>({
    fid: null,
    action: null
  });
  
  // Parse URL parameters
  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fid = urlParams.get('fid');
    const action = urlParams.get('action');
    
    if (fid || action) {
      setFarcasterParams({
        fid: fid,
        action: action
      });
      
      // If coming from Farcaster with action=record, simulate connection
      if (action === 'record') {
        setSimulateConnected(true);
      }
    }
  }, []);
  
  useEffect(() => {
    // Initialize Farcaster SDK
    sdk.actions.ready({ disableNativeGestures: true });
    
    // Parse URL parameters
    parseUrlParams();
  }, [parseUrlParams]);

  return (
    <div className="app-container">
      <header>
        <h1>Audio Token Minter</h1>
        <p>Record a 5-second audio clip and create an ERC-20 token</p>
        
        {/* Testing controls - only visible in development */}
        {import.meta.env.DEV && (
          <div className="dev-controls">
            <button 
              onClick={() => setSimulateConnected(!simulateConnected)}
              style={{ 
                background: simulateConnected ? '#5cff5c' : '#ff5c5c',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              {simulateConnected ? 'Simulate Disconnected' : 'Simulate Connected'}
            </button>
          </div>
        )}
      </header>
      
      <main>
        <ConnectMenu 
          simulateConnected={simulateConnected} 
          farcasterParams={farcasterParams} 
        />
      </main>
      
      <footer>
        <p>Powered by Farcaster</p>
      </footer>
    </div>
  );
}

interface ConnectMenuProps {
  simulateConnected?: boolean;
  farcasterParams: FarcasterParams;
}

function ConnectMenu({ simulateConnected = false, farcasterParams }: ConnectMenuProps) {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  
  // Mock address for testing
  const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  
  // Use real connection or simulated one
  const connected = isConnected || simulateConnected;
  const displayAddress = address || (simulateConnected ? mockAddress : "");

  if (connected) {
    return (
      <div className="connected-container">
        <div className="account-info">
          <div>Connected account:</div>
          <div className="address">{displayAddress}</div>
        </div>
        
        {farcasterParams.action === 'view' ? (
          <TokenList tokens={mockTokens} fid={farcasterParams.fid} />
        ) : (
          <AudioTokenMinter farcasterParams={farcasterParams} />
        )}
        
        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <a 
            href="/?action=record" 
            className={`nav-button ${farcasterParams.action !== 'view' ? 'active' : ''}`}
          >
            Record Audio
          </a>
          <a 
            href="/?action=view" 
            className={`nav-button ${farcasterParams.action === 'view' ? 'active' : ''}`}
          >
            View Tokens
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-container">
      <p>Connect your wallet to start recording and creating tokens</p>
      
      <div className="wallet-buttons">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            className="connect-button"
            type="button"
            onClick={() => connect({ connector })}
          >
            {connector.name === "Coinbase Wallet" ? "Connect Coinbase Wallet" : 
             connector.name === "Farcaster Frame" ? "Connect with Farcaster" : 
             `Connect ${connector.name}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
