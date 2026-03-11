class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.connectionTimeout = null;
    this.url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
    this.fallbackMode = false;
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    
    // Set connection timeout
    this.connectionTimeout = setTimeout(() => {
      if (this.isConnecting) {
        console.log('WebSocket connection timeout - enabling fallback mode');
        this.enableFallbackMode();
      }
    }, 3000);
    
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        clearTimeout(this.connectionTimeout);
        this.isConnecting = false;
        this.fallbackMode = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { timestamp: new Date().toISOString() });
        
        // Start heartbeat
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data.payload);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        clearTimeout(this.connectionTimeout);
        this.isConnecting = false;
        this.emit('disconnected', { code: event.code, reason: event.reason });
        
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts && !this.fallbackMode) {
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
          }, this.reconnectInterval);
        } else {
          console.log('Max reconnection attempts reached - enabling fallback mode');
          this.enableFallbackMode();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(this.connectionTimeout);
        this.isConnecting = false;
        this.emit('error', { error: error.message });
        
        // Enable fallback mode on error
        if (!this.fallbackMode) {
          this.enableFallbackMode();
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      clearTimeout(this.connectionTimeout);
      this.isConnecting = false;
      this.emit('error', { error: error.message });
      this.enableFallbackMode();
    }
  }

  enableFallbackMode() {
    this.fallbackMode = true;
    console.log('🔄 WebSocket fallback mode enabled - using simulated updates');
    this.emit('fallback-enabled', { message: 'Using simulated real-time updates' });
    
    // Start simulated updates
    this.simulateRealTimeUpdates();
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnecting = false;
    this.fallbackMode = false;
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
      this.ws.send(message);
    } else {
      console.warn('WebSocket not connected, message not sent:', { type, payload });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send('heartbeat', { timestamp: new Date().toISOString() });
    }, 30000); // Send heartbeat every 30 seconds
  }

  // Real-time data methods
  subscribeToDashboardUpdates() {
    this.send('subscribe', { channel: 'dashboard' });
  }

  subscribeToPipelineUpdates() {
    this.send('subscribe', { channel: 'pipeline' });
  }

  subscribeToAlerts() {
    this.send('subscribe', { channel: 'alerts' });
  }

  unsubscribeFromChannel(channel) {
    this.send('unsubscribe', { channel });
  }

  // Mock WebSocket events for development
  simulateRealTimeUpdates() {
    // Only simulate if not already running or in fallback mode
    if (this.simulationInterval) {
      return;
    }
    
    console.log('🔄 Starting simulated real-time updates...');
    this.simulationInterval = setInterval(() => {
      const updateTypes = ['scraping', 'processing', 'creation', 'delivery', 'clients'];
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      this.emit(randomType, {
        type: randomType,
        timestamp: new Date().toISOString(),
        data: {
          value: Math.floor(Math.random() * 100),
          status: Math.random() > 0.3 ? 'success' : 'warning',
          message: `${randomType} operation completed successfully`
        }
      });
    }, 30000); // Changed from 5000ms to 30000ms (30 seconds) - FIX FOR AUTO-REFRESH
  }
}

// Create singleton instance
const wsService = new WebSocketService();

export default wsService;
