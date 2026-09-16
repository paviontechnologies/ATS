import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(`\x1b[1;36m=========================================================================\x1b[0m`);
console.log(`\x1b[1;32m🚀 STARTING FULL ENTERPRISE ATS MULTI-SERVICE FLEET\x1b[0m`);
console.log(`\x1b[1;34m  1. Core REST API Gateway:     http://localhost:5000/api/v1 (Docs: /docs)\x1b[0m`);
console.log(`\x1b[1;35m  2. Admin API Gateway:         http://localhost:5001/api/v1 (Docs: /docs)\x1b[0m`);
console.log(`\x1b[1;33m  3. Frontend SPA Client:       http://localhost:3001\x1b[0m`);
console.log(`\x1b[1;32m  4. Database Engine:           MySQL Relational Engine\x1b[0m`);
console.log(`\x1b[1;36m=========================================================================\x1b[0m\n`);

const services = [
  {
    name: 'CORE-API (5000)',
    color: '\x1b[34m',
    cmd: 'node',
    args: ['server/src/index.js'],
    env: { ...process.env, PORT: '5000' }
  },
  {
    name: 'ADMIN-API (5001)',
    color: '\x1b[35m',
    cmd: 'node',
    args: ['server/src/adminServer.js'],
    env: { ...process.env, ADMIN_PORT: '5001' }
  },
  {
    name: 'FRONTEND (3001)',
    color: '\x1b[33m',
    cmd: 'node',
    args: ['client/server.js'],
    env: { ...process.env, CLIENT_PORT: '3001', CORE_API_URL: 'http://127.0.0.1:5000', ADMIN_API_URL: 'http://127.0.0.1:5001' }
  }
];

const children = [];

for (const svc of services) {
  const child = spawn(svc.cmd, svc.args, {
    cwd: rootDir,
    env: svc.env,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}]\x1b[0m ${line}`);
      }
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${svc.color}[${svc.name} ERR]\x1b[0m ${line}`);
      }
    }
  });

  child.on('exit', (code) => {
    console.log(`${svc.color}[${svc.name}]\x1b[0m process exited with code ${code}`);
  });

  children.push(child);
}

// Graceful shutdown
function handleShutdown() {
  console.log('\n\x1b[1;31mTerminating all ATS services...\x1b[0m');
  for (const child of children) {
    child.kill('SIGINT');
  }
  process.exit(0);
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
