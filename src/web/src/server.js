const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 WebSocket Server starting on port 8080...');

wss.on('connection', (ws) => {
  console.log('📡 Client connected to WebSocket');
  
  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    payload: { timestamp: new Date().toISOString() }
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data.type);
      
      // Echo back subscription messages
      if (data.type === 'subscribe') {
        ws.send(JSON.stringify({
          type: 'subscribed',
          payload: { channel: data.payload.channel }
        }));
      }
      
      // Handle heartbeat
      if (data.type === 'heartbeat') {
        ws.send(JSON.stringify({
          type: 'heartbeat-response',
          payload: { timestamp: new Date().toISOString() }
        }));
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('📡 Client disconnected');
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Simulate real-time updates every 30 seconds (FIX: was 5 seconds causing auto-refresh)
setInterval(() => {
  const updateTypes = ['scraping', 'processing', 'creation', 'delivery', 'clients'];
  const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
  
  const update = {
    type: randomType,
    payload: {
      type: randomType,
      timestamp: new Date().toISOString(),
      data: {
        value: Math.floor(Math.random() * 100),
        status: Math.random() > 0.3 ? 'success' : 'warning',
        message: `${randomType} operation completed successfully`
      }
    }
  };
  
  // Broadcast to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(update));
      } catch (error) {
        console.error('Error sending to client:', error);
      }
    }
  });
}, 30000); // Changed from 5000ms to 30000ms (30 seconds) - FIX FOR AUTO-REFRESH

console.log('✅ WebSocket Server running on ws://localhost:8080');
