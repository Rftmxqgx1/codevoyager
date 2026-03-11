import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal Component</div>;
};

// Component with async error
const AsyncErrorComponent = () => {
  React.useEffect(() => {
    setTimeout(() => {
      throw new Error('Async error');
    }, 100);
  }, []);
  return <div>Async Component</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component')).toBeInTheDocument();
  });

  it('catches and displays error when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We\'re sorry, but something unexpected happened.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('displays error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('hides error details in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('generates unique error ID', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorId1 = screen.getByText(/Error ID:/).textContent;
    unmount();

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorId2 = screen.getByText(/Error ID:/).textContent;
    expect(errorId1).not.toBe(errorId2);
  });

  it('handles retry functionality', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error state
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Should show normal component after retry
    rerender(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Component')).toBeInTheDocument();
  });

  it('handles reload functionality', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });

  it('uses custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom Error Fallback</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('handles async errors', (done) => {
    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    // Wait for async error to be caught
    setTimeout(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      done();
    }, 200);
  });

  it('sends error to logging service in production', (done) => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    setTimeout(() => {
      expect(fetch).toHaveBeenCalledWith('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test error message')
      });

      process.env.NODE_ENV = originalNodeEnv;
      global.fetch.mockRestore();
      done();
    }, 100);
  });

  it('includes user information in error report', () => {
    const mockUser = { id: 'user123', username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    );

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    setTimeout(() => {
      const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(requestBody.userId).toBe('user123');

      process.env.NODE_ENV = originalNodeEnv;
      global.fetch.mockRestore();
      localStorage.clear();
    }, 100);
  });

  it('handles fetch errors gracefully', (done) => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    // Mock console.error to catch the fetch error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    setTimeout(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to log error to service:', expect.any(Error));

      process.env.NODE_ENV = originalNodeEnv;
      global.fetch.mockRestore();
      consoleSpy.mockRestore();
      done();
    }, 100);
  });
});
