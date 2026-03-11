const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CodeVoyager Development Environment...');
console.log('📡 WebSocket Server: ws://localhost:8080');
console.log('🌐 React App: http://localhost:3000');
console.log('');

// Start WebSocket server
const wsServer = spawn('node', ['src/web/server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start React development server
const reactServer = spawn('npm', ['start'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  wsServer.kill('SIGINT');
  reactServer.kill('SIGINT');
  process.exit(0);
});

wsServer.on('close', (code) => {
  console.log(`WebSocket server exited with code ${code}`);
});

reactServer.on('close', (code) => {
  console.log(`React server exited with code ${code}`);
});
