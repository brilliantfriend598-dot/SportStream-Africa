#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const expoPath = path.join(__dirname, 'node_modules', 'expo', 'bin', 'cli.js');
const args = process.argv.slice(2);

// Determine the command
let command = 'start';
let flags = ['--web'];

if (args.includes('--android')) {
  flags = ['start', '--android'];
} else if (args.includes('--ios')) {
  flags = ['start', '--ios'];
} else {
  flags = ['start', '--web'];
}

try {
  execSync(`node "${expoPath}" ${flags.join(' ')}`, {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH}` },
  });
} catch (error) {
  process.exit(1);
}

