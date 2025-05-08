#!/usr/bin/env node

/**
 * This script updates the URLs in the application based on the hosting provider.
 * Usage: node scripts/update-urls.js --domain yourdomain.com
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let domain = 'reliefyourcurse.vercel.app'; // Default domain

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' && i + 1 < args.length) {
    domain = args[i + 1];
    break;
  }
}

console.log(`Updating URLs to use domain: ${domain}`);

// Files to update
const filesToUpdate = [
  {
    path: 'public/frame.html',
    replacements: [
      {
        search: /content="https:\/\/[^/]+\/audio-token-minter\.png"/g,
        replace: `content="https://${domain}/audio-token-minter.png"`
      },
      {
        search: /content="https:\/\/[^/]+\/api\/frame"/g,
        replace: `content="https://${domain}/api/frame"`
      },
      {
        search: /href="https:\/\/[^/]+\/"/g,
        replace: `href="https://${domain}/"`
      }
    ]
  },
  {
    path: 'api/frame.js',
    replacements: [
      {
        search: /redirectUrl = `https:\/\/[^/]+\/\?fid=\${fid}&action=\${action}`;/g,
        replace: `redirectUrl = \`https://${domain}/?fid=\${fid}&action=\${action}\`;`
      },
      {
        search: /content="https:\/\/[^/]+\/audio-token-minter\.png"/g,
        replace: `content="https://${domain}/audio-token-minter.png"`
      }
    ]
  },
  {
    path: 'netlify/functions/frame.js',
    replacements: [
      {
        search: /redirectUrl = `https:\/\/[^/]+\/\?fid=\${fid}&action=\${action}`;/g,
        replace: `redirectUrl = \`https://${domain}/?fid=\${fid}&action=\${action}\`;`
      },
      {
        search: /content="https:\/\/[^/]+\/audio-token-minter\.png"/g,
        replace: `content="https://${domain}/audio-token-minter.png"`
      }
    ]
  }
];

// Update each file
filesToUpdate.forEach(file => {
  // Get the project root directory (two levels up from the script)
  const projectRoot = path.resolve(__dirname, '..');
  const filePath = path.join(projectRoot, file.path);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    file.replacements.forEach(replacement => {
      content = content.replace(replacement.search, replacement.replace);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file.path}`);
  } else {
    console.log(`File not found: ${file.path}`);
  }
});

console.log('URL updates complete!');
console.log('Rebuilding the application...');

// Rebuild the application
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build complete! The application is ready for deployment.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
