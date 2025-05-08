# Audio Token Minter - Deployment Guide

This guide provides instructions for deploying the Audio Token Minter Farcaster mini app to production.

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- A Vercel account (recommended) or another hosting service that supports:
  - Static file hosting
  - API routes/serverless functions
  - HTTPS

## Build Process

The application has already been built for production. The build output is in the `dist` directory and includes:

- HTML, CSS, and JavaScript files
- Static assets
- API endpoints

## Deployment Options

### Updating URLs for Your Domain

Before deploying, you should update all URLs in the application to use your domain:

```bash
# Update URLs with your domain
npm run update-urls -- --domain yourdomain.com

# The script will automatically rebuild the application
```

This script updates all URLs in the application to use your domain and rebuilds the application.

### Option 1: Vercel (Recommended)

Vercel is the recommended hosting service for this application due to its excellent support for React applications and API routes.

#### Steps for Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the Application**:
   ```bash
   # Using npm script
   npm run deploy:vercel
   
   # Or directly
   cd reliefyourcurse
   vercel
   ```

4. **Follow the Prompts**:
   - Link to an existing project or create a new one
   - Configure project settings
   - Confirm deployment

5. **Deploy to Production**:
   ```bash
   # Using npm script
   npm run deploy:vercel:prod
   
   # Or directly
   vercel --prod
   ```

6. **Configure Environment Variables** (if needed):
   - Go to your project settings in the Vercel dashboard
   - Navigate to the "Environment Variables" section
   - Add any required environment variables

### Option 2: Netlify

Netlify is another excellent option for hosting this application.

#### Steps for Netlify Deployment

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Create a `netlify.toml` File**:
   ```toml
   [build]
     publish = "dist"
     functions = "netlify/functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

4. **Create a Functions Directory**:
   ```bash
   mkdir -p netlify/functions
   ```

5. **Move API Files to Functions Directory**:
   - Create a file at `netlify/functions/frame.js` that exports your API handler

6. **Deploy the Application**:
   ```bash
   # Using npm script
   npm run deploy:netlify
   
   # Or directly
   netlify deploy
   ```

7. **Deploy to Production**:
   ```bash
   # Using npm script
   npm run deploy:netlify:prod
   
   # Or directly
   netlify deploy --prod
   ```

8. **Note**: The project already includes a configured `netlify.toml` file and a Netlify function for the Frame API in the `netlify/functions` directory.

### Option 3: GitHub Pages + Separate API Hosting

If you prefer to use GitHub Pages for static content, you'll need to host the API endpoints separately.

#### Steps for GitHub Pages Deployment

1. **Create a GitHub Repository**:
   - Create a new repository on GitHub
   - Push your code to the repository

2. **Configure GitHub Pages**:
   - Go to the repository settings
   - Navigate to the "Pages" section
   - Select the `dist` directory as the source
   - Save the settings

3. **Host API Endpoints Separately**:
   - Deploy the API endpoints to a service like Vercel, Netlify, or AWS Lambda
   - Update the URLs in the application to point to the API endpoints

## Post-Deployment Tasks

After deploying the application, you should:

1. **Verify Frame Functionality**:
   - Use the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames) to verify that your frame works correctly
   - Test all buttons and actions

2. **Test User Flows**:
   - Test recording audio and creating tokens
   - Test viewing tokens
   - Test sharing back to Farcaster

3. **Update Documentation**:
   - Update the README.md with production URLs
   - Document any environment-specific configurations

## Troubleshooting

### Common Issues

1. **API Routes Not Working**:
   - Ensure that the API routes are properly configured in your hosting service
   - Check that the URLs in the application match the deployed API endpoints

2. **CORS Errors**:
   - Configure CORS headers in your API routes to allow requests from Farcaster

3. **Frame Validation Errors**:
   - Ensure that all URLs in the frame metadata are absolute and use HTTPS
   - Verify that the frame.html file is accessible from the internet

4. **Missing Static Assets**:
   - Check that all static assets are properly included in the build
   - Verify that the paths to static assets are correct

## Future Enhancements

After successful deployment, consider implementing these enhancements:

1. **Real Clanker Contract Integration**:
   - Update the contract address to use the real Clanker contract
   - Test token creation with the real contract

2. **Audio Storage**:
   - Implement IPFS storage for audio files
   - Link audio content to token utility

3. **Real Audio Summarization**:
   - Integrate with a speech-to-text API
   - Implement real summarization of audio content

## Support

If you encounter any issues during deployment, please:

1. Check the hosting service's documentation
2. Review the error logs in the hosting service's dashboard
3. Consult the Farcaster Frame documentation for frame-specific issues
