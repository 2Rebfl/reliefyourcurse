// Netlify function for Farcaster Frame interactions
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the incoming frame data
    const body = JSON.parse(event.body);
    const { untrustedData } = body;
    
    // Validate the frame data
    if (!untrustedData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid frame data' })
      };
    }

    // Extract user information
    const { fid, buttonIndex } = untrustedData;
    
    // Generate a redirect URL to the main app with user context
    let redirectUrl;
    let action;
    
    if (buttonIndex === 1) {
      // Button 1: Record Audio & Create Token
      action = 'record';
      redirectUrl = `https://reliefyourcurse-e4eoqixux-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    } else if (buttonIndex === 2) {
      // Button 2: View My Tokens
      action = 'view';
      redirectUrl = `https://reliefyourcurse-e4eoqixux-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    } else {
      // Default action
      action = 'record';
      redirectUrl = `https://reliefyourcurse-e4eoqixux-fluodolab3s-projects.vercel.app/?fid=${fid}&action=${action}`;
    }
    
    // Return the frame response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        frameHtml: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Audio Token Minter</title>
            
            <!-- Farcaster Frame Metadata -->
            <meta property="fc:frame" content="vNext">
            <meta property="fc:frame:image" content="https://reliefyourcurse-e4eoqixux-fluodolab3s-projects.vercel.app/audio-token-minter.png">
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
      })
    };
  } catch (error) {
    console.error('Frame API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
