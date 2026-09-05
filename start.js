import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Consensus Akademik Asistan başlatılıyor...');

// 1. Start backend server
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: '4000' },
  stdio: 'inherit',
  shell: true
});

// 2. Start client Vite dev server
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// Failsafe: ensure browser opens automatically
setTimeout(() => {
  const url = 'http://localhost:3000';
  const openCmd = isWindows ? `start ${url}` : `open ${url}`;
  exec(openCmd, () => {});
}, 2000);

process.on('SIGINT', () => {
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
});
