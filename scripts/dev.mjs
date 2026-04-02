import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const nodeBin = process.execPath;

const definitions = [
  {
    name: 'frontend',
    cwd: rootDir,
    args: [resolve(rootDir, 'node_modules/vite/bin/vite.js'), '--host', '0.0.0.0'],
  },
  {
    name: 'backend',
    cwd: resolve(rootDir, 'server'),
    args: [resolve(rootDir, 'server/node_modules/tsx/dist/cli.mjs'), 'watch', 'src/index.ts'],
  },
];

let shuttingDown = false;
const children = [];

const stopAll = () => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

for (const { name, cwd, args } of definitions) {
  const child = spawn(nodeBin, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`${name} failed to start`, error);
    stopAll();
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      stopAll();
      if (signal) {
        console.error(`${name} exited with signal ${signal}`);
        process.exit(1);
      }
      process.exit(code ?? 0);
    }
  });

  children.push(child);
}

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
