# Audio Token Minter - Technical Context

## Architecture Overview

The Audio Token Minter is built as a React application using TypeScript and Vite. It integrates with the Farcaster Frame SDK for wallet connections and uses the Web Audio API for audio recording.

## Key Components

### 1. App Component (`App.tsx`)
- Main application component
- Handles the overall layout and structure
- Includes development mode for simulating wallet connections
- Parses URL parameters for Farcaster Frame integration
- Conditionally renders components based on Farcaster actions

### 2. Audio Recorder Component (`AudioRecorder.tsx`)
- Handles audio recording using the Web Audio API
- Manages recording state and timer
- Limits recordings to 5 seconds
- Provides UI for starting and stopping recordings
- Supports auto-start recording for Farcaster Frame integration

### 3. Audio Token Minter Component (`AudioTokenMinter.tsx`)
- Manages the token creation process using Clanker
- Handles the simulated summarization of audio content
- Interacts with the Clanker contract for token deployment
- Displays recording and token creation status
- Integrates with Farcaster SDK for sharing token creation

### 4. Token List Component (`TokenList.tsx`)
- Displays a list of created tokens
- Provides token details view
- Handles token selection and navigation
- Shows Farcaster user ID when applicable

### 5. Farcaster Frame Integration
- **frame.html**: Static HTML file with Farcaster Frame metadata
- **frame.js**: API endpoint for handling frame interactions
- Supports multiple button actions (record, view tokens)
- Handles redirects with appropriate parameters

## Technical Implementation Details

### Farcaster Frame Integration
The app integrates with Farcaster Frames to provide a seamless experience for Farcaster users:

- **Frame Metadata**: The `frame.html` file includes the necessary metadata for Farcaster to recognize and display the frame:
  ```html
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="https://placehold.co/1200x630/181818/5c5cff?text=Audio+Token+Minter">
  <meta property="fc:frame:button:1" content="Record Audio & Create Token">
  <meta property="fc:frame:button:1:action" content="post_redirect">
  <meta property="fc:frame:button:2" content="View My Tokens">
  <meta property="fc:frame:button:2:action" content="post_redirect">
  <meta property="fc:frame:post_url" content="https://reliefyourcurse.vercel.app/api/frame">
  ```

- **Frame API Endpoint**: The `frame.js` file handles POST requests from Farcaster when users interact with the frame:
  ```javascript
  // Extract user information
  const { fid, buttonIndex } = untrustedData;
  
  // Generate a redirect URL based on the button clicked
  let redirectUrl;
  let action;
  
  if (buttonIndex === 1) {
    // Button 1: Record Audio & Create Token
    action = 'record';
    redirectUrl = `/?fid=${fid}&action=${action}`;
  } else if (buttonIndex === 2) {
    // Button 2: View My Tokens
    action = 'view';
    redirectUrl = `/?fid=${fid}&action=${action}`;
  }
  ```

- **URL Parameter Handling**: The app extracts Farcaster parameters from the URL:
  ```typescript
  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fid = urlParams.get('fid');
    const action = urlParams.get('action');
    
    if (fid || action) {
      setFarcasterParams({
        fid: fid,
        action: action
      });
    }
  }, []);
  ```

- **Automatic Actions**: The app performs automatic actions based on the Farcaster parameters:
  - Auto-start recording when `action=record`
  - Show token list when `action=view`
  - Share back to Farcaster after token creation using `sdk.actions.composeCast()`

### Audio Recording
The app uses the Web Audio API's `MediaRecorder` interface to capture audio from the user's microphone. The implementation:
- Requests microphone access using `navigator.mediaDevices.getUserMedia()`
- Creates a `MediaRecorder` instance to record audio
- Collects audio data in chunks
- Combines chunks into a single audio blob when recording stops
- Limits recording to 5 seconds using a timer

### Wallet Integration
The app integrates with the user's wallet using:
- Farcaster Frame SDK for the frame environment
- Wagmi for wallet connections and contract interactions
- The `farcasterFrame` connector from `@farcaster/frame-wagmi-connector`
- Coinbase Wallet connector for additional wallet support

The wallet configuration in `wagmi.ts` supports multiple connectors:
```typescript
// src/wagmi.ts
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
      appLogoUrl: "https://example.com/logo.png",
    }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
```

### Token Creation with Clanker
The token creation process:
1. Generates a token name and symbol based on the audio summary
2. Sets parameters for token deployment (supply, fee tier, price, lock amount, etc.)
3. Calls the `deployToken` function on the Clanker contract
4. Displays the created token address, symbol, and name

### Development Mode
For easier testing, the app includes a development mode that:
- Allows simulating wallet connections without a real wallet
- Uses a mock wallet address for testing
- Toggles between connected and disconnected states

## Dependencies

- `@farcaster/frame-sdk`: Provides the Farcaster Frame SDK
- `@farcaster/frame-wagmi-connector`: Provides the Farcaster Frame connector for Wagmi
- `@coinbase/wallet-sdk`: Provides the Coinbase Wallet SDK
- `@wagmi/connectors`: Provides additional wallet connectors for Wagmi
- `@wagmi/core`: Core functionality for Wagmi
- `@tanstack/react-query`: Handles data fetching and caching
- `react` and `react-dom`: Core React libraries
- `viem`: Ethereum interface library
- `wagmi`: React hooks for Ethereum

## Build and Deployment

The app is built using Vite, which provides:
- Fast development server with HMR
- Optimized production builds
- TypeScript support
- React support

To build the app for production:
```bash
npm run build
```

The build output is in the `dist` directory, which can be deployed to any static hosting service.

### Deployment Tools and Configuration

The project includes several tools and configurations to facilitate deployment:

#### URL Management

A utility script (`scripts/update-urls.js`) is provided to update all URLs in the application based on the deployment domain:

```bash
# Update URLs with your domain
npm run update-urls -- --domain yourdomain.com
```

This script:
- Updates all URLs in frame.html and frame.js to use the specified domain
- Rebuilds the application automatically after updating URLs
- Ensures all URLs are absolute and use HTTPS

#### NPM Scripts for Deployment

The package.json includes several scripts for deployment:

```json
"scripts": {
  "update-urls": "node scripts/update-urls.js",
  "deploy:vercel": "vercel",
  "deploy:vercel:prod": "vercel --prod",
  "deploy:netlify": "netlify deploy",
  "deploy:netlify:prod": "netlify deploy --prod"
}
```

#### Vercel Deployment

Vercel is the recommended hosting option for this application due to its excellent support for React applications and API routes:

1. **Setup**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   # Using npm script
   npm run deploy:vercel
   
   # Or directly
   vercel
   ```

3. **Production Deployment**:
   ```bash
   # Using npm script
   npm run deploy:vercel:prod
   
   # Or directly
   vercel --prod
   ```

4. **Environment Variables**:
   - Set up environment variables in the Vercel dashboard
   - Configure production URLs for Farcaster Frame integration

#### Netlify Deployment

Netlify is another excellent option for hosting this application. The project includes Netlify-specific configurations:

1. **Netlify Configuration**:
   The project includes a `netlify.toml` file:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[headers]]
     for = "/*"
       [headers.values]
       Access-Control-Allow-Origin = "*"
       Access-Control-Allow-Methods = "GET, POST, OPTIONS"
       Access-Control-Allow-Headers = "Content-Type"
   ```

2. **Netlify Functions**:
   The project includes a Netlify function for the Frame API in `netlify/functions/frame.js`

3. **Deploy**:
   ```bash
   # Using npm script
   npm run deploy:netlify
   
   # Or directly
   netlify deploy
   ```

4. **Production Deployment**:
   ```bash
   # Using npm script
   npm run deploy:netlify:prod
   
   # Or directly
   netlify deploy --prod
   ```

### Farcaster Frame Production Requirements

For the Farcaster Frame to work correctly in production:

1. **HTTPS**: The application must be served over HTTPS
2. **CORS**: API endpoints must have appropriate CORS headers
3. **URL Configuration**: All URLs in frame.html and frame.js must be absolute and point to the production domain
4. **Frame Validation**: The frame must pass validation using the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames)

### Post-Deployment Verification

After deploying to production:

1. **Frame Validation**:
   - Use the Farcaster Frame Validator to verify the frame
   - Check that all buttons work as expected
   - Verify that redirects work correctly

2. **App Testing**:
   - Test the app with different wallet providers
   - Verify that recording and token creation work
   - Check that token viewing works correctly
   - Test sharing back to Farcaster

## Security Considerations

- The app requires microphone access, which should be handled securely
- Wallet connections should be secure and transparent
- Token creation should include proper error handling and transaction confirmation
- In a production environment, the Clanker contract address should be verified and secure
