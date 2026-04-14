#!/usr/bin/env node
process.env.PATH = 'C:\\Program Files\\nodejs;' + process.env.PATH;

const { execSync } = require('child_process');

console.log('\n========================================');
console.log('SportStream Africa - Mobile Testing');
console.log('========================================\n');

console.log('Starting Expo development server...\n');

try {
  execSync('npm run web', {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096',
      PATH: 'C:\\Program Files\\nodejs;' + process.env.PATH,
    },
  });
} catch (error) {
  console.error('Error starting server:', error.message);
  process.exit(1);
}
