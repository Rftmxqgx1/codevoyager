import React, { Component } from 'react';

class AsyncErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    
    // Handle async errors specifically
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      this.handleChunkLoadError(error);
    } else {
      this.handleAsyncError(error, errorInfo);
    }
  }

  handleChunkLoadError = (error) => {
    console.log('Chunk load error detected, attempting recovery...');
    
    // Attempt to reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  handleAsyncError = (error, errorInfo) => {
    // Log to external service
    if (process.env.NODE_ENV === 'production') {
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        type: 'async',
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(console.error);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message?.includes('Loading chunk');

      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isChunkError ? '#e3f2fd' : '#fff3e0',
          border: `1px solid ${isChunkError ? '#1976d2' : '#ffcc02'}`,
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>
            {isChunkError ? '🔄' : '⚠️'}
          </div>
          
          <h2 style={{ 
            color: isChunkError ? '#1976d2' : '#d32f2f', 
            fontSize: '20px', 
            marginBottom: '12px' 
          }}>
            {isChunkError ? 'Updating Application' : 'Async Operation Failed'}
          </h2>
          
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {isChunkError 
              ? 'A new version of the application is available. The page will reload automatically.'
              : 'An asynchronous operation failed. Please try again or reload the page.'
            }
          </p>

          {!isChunkError && (
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              Retry Operation
            </button>
          )}

          <div style={{ 
            marginTop: '16px', 
            fontSize: '12px', 
            color: '#666' 
          }}>
            <strong>Error ID:</strong> {this.state.errorId}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AsyncErrorBoundary;
