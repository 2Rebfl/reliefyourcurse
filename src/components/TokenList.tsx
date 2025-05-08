import { useState } from "react";

interface Token {
  id: number;
  name: string;
  symbol: string;
  address: string;
  createdAt: string;
}

interface TokenListProps {
  tokens: Token[];
  fid?: string | null;
}

const TokenList = ({ tokens, fid }: TokenListProps) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
  };

  const handleBackClick = () => {
    setSelectedToken(null);
  };

  if (selectedToken) {
    return (
      <div className="token-details">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to List
        </button>
        
        <h2>{selectedToken.name}</h2>
        
        <div className="token-detail-item">
          <span className="label">Symbol:</span>
          <span className="value">{selectedToken.symbol}</span>
        </div>
        
        <div className="token-detail-item">
          <span className="label">Address:</span>
          <span className="value address">{selectedToken.address}</span>
        </div>
        
        <div className="token-detail-item">
          <span className="label">Created:</span>
          <span className="value">{formatDate(selectedToken.createdAt)}</span>
        </div>
        
        <div className="token-actions">
          <button className="action-button">
            View on Explorer
          </button>
          <button className="action-button">
            Share Token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="token-list-container">
      <h2>Your Audio Tokens</h2>
      {fid && <p className="fid-info">Farcaster ID: {fid}</p>}
      
      {tokens.length === 0 ? (
        <div className="no-tokens">
          <p>You haven't created any audio tokens yet.</p>
          <a href="/?action=record" className="create-token-link">
            Create your first token
          </a>
        </div>
      ) : (
        <div className="token-list">
          {tokens.map((token) => (
            <div 
              key={token.id} 
              className="token-item"
              onClick={() => handleTokenClick(token)}
            >
              <div className="token-name">{token.name}</div>
              <div className="token-symbol">{token.symbol}</div>
              <div className="token-date">{formatDate(token.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenList;
