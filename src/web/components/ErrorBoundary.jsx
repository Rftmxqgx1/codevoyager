import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorId: Math.random().toString(36).substr(2, 9) };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external services
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  logErrorToService = (error, errorInfo) => {
    try {
      // Send error to logging service
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId()
      };

      // In production, send to your error tracking service
      // Example: Sentry, LogRocket, custom endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      }).catch(err => {
        console.error('Failed to log error to service:', err);
      });
    } catch (err) {
      console.error('Error logging failed:', err);
    }
  };

  getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fff3e0',
          border: '1px solid #ffcc02',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          
          <h1 style={{ 
            color: '#d32f2f', 
            fontSize: '24px', 
            marginBottom: '16px' 
          }}>
            Something went wrong
          </h1>
          
          <p style={{ 
            color: '#666', 
            fontSize: '16px', 
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            We're sorry, but something unexpected happened. 
            Our team has been notified and is working on a fix.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              textAlign: 'left', 
              backgroundColor: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                marginBottom: '10px' 
              }}>
                Error Details (Development Only)
              </summary>
              
              <div style={{ marginTop: '10px' }}>
                <strong>Error ID:</strong> {this.state.errorId}<br/>
                <strong>Error Message:</strong> {this.state.error.message}<br/>
                <strong>Error Stack:</strong>
                <pre style={{ 
                  backgroundColor: '#fff', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px',
                  fontSize: '12px'
                }}>
                  {this.state.error.stack}
                </pre>
                
                {this.state.errorInfo && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Component Stack:</strong>
                    <pre style={{ 
                      backgroundColor: '#fff', 
                      padding: '10px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '150px',
                      fontSize: '12px'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              Try Again
            </button>
            
            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
            >
              Reload Page
            </button>
          </div>

          <div style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
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

export default ErrorBoundary;
