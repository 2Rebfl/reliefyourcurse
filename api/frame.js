// API handler for Farcaster Frame interactions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming frame data
    const { untrustedData } = req.body;
    
    // Validate the frame data
    if (!untrustedData) {
      return res.status(400).json({ error: 'Invalid frame data' });
    }

    // Extract user information
    const { fid, buttonIndex } = untrustedData;
    
    // Generate a redirect URL to the main app with user context
    let redirectUrl;
    let action;
    
    if (buttonIndex === 1) {
      // Button 1: Record Audio & Create Token
      action = 'record';
      redirectUrl = `https://reliefyourcurse-2jta4n4ct-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    } else if (buttonIndex === 2) {
      // Button 2: View My Tokens
      action = 'view';
      redirectUrl = `https://reliefyourcurse-2jta4n4ct-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    } else {
      // Default action
      action = 'record';
      redirectUrl = `https://reliefyourcurse-2jta4n4ct-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    }
    
    // Return the frame response
    return res.status(200).json({
      frameHtml: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Audio Token Minter</title>
          
          <!-- Farcaster Frame Metadata -->
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="https://reliefyourcurse-2jta4n4ct-fluodolab3s-projects.vercel.app/audio-token-minter.png">
          <meta property="fc:frame:button:1" content="Open App">
          <meta property="fc:frame:button:1:action" content="link">
          <meta property="fc:frame:button:1:target" content="${redirectUrl}">
        </head>
        <body>
          <h1>Audio Token Minter</h1>
          <p>${action === 'record' ? 'Click to open the app and start recording' : 'Click to view your tokens'}</p>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
