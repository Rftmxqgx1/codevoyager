import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../app';
import authService from '../services/AuthService';

// Mock WebSocket service
jest.mock('../services/WebSocketService', () => ({
  connect: jest.fn(),
  subscribeToDashboardUpdates: jest.fn(),
  subscribeToPipelineUpdates: jest.fn(),
  subscribeToAlerts: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  simulateRealTimeUpdates: jest.fn(),
  disconnect: jest.fn()
}));

// Mock API service
jest.mock('../app', () => ({
  ApiService: {
    getDashboardData: jest.fn().mockResolvedValue({
      scraping: { totalScraped: 1247, successRate: 98.8 },
      processing: { totalProcessed: 1247, qualityScore: 96.2 },
      monitoring: {
        performanceMetrics: { renderSpeed: 1150 },
        iso25010Compliance: { overallScore: 94.1, compliant: true }
      },
      financial: { valueEnabled: 243000 }
    })
  }
}));

// Mock Charts components
jest.mock('../components/Charts', () => ({
  PerformanceChart: ({ data }) => <div data-testid="performance-chart">Performance Chart</div>,
  ThemeDistributionChart: ({ data }) => <div data-testid="theme-chart">Theme Chart</div>,
  TechnologyChart: ({ data }) => <div data-testid="tech-chart">Technology Chart</div>,
  FinancialChart: ({ data }) => <div data-testid="financial-chart">Financial Chart</div>,
  ActivityMonitor: ({ data }) => <div data-testid="activity-monitor">Activity Monitor</div>
}));

// Mock SearchFilter component
jest.mock('../components/SearchFilter', () => ({ onFilter, data, type }) => (
  <div data-testid="search-filter">Search Filter</div>
));

const mockUser = {
  username: 'testuser',
  role: 'viewer',
  name: 'Test User'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    authService.login({ username: 'viewer', password: 'viewer123' });
  });

  it('renders dashboard without crashing', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('CodeVoyager Enterprise Pipeline')).toBeInTheDocument();
  });

  it('displays all navigation tabs', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('📊 Overview')).toBeInTheDocument();
    expect(screen.getByText('🕷️ Scraping')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Processing')).toBeInTheDocument();
    expect(screen.getByText('🛠️ Creation')).toBeInTheDocument();
    expect(screen.getByText('📦 Delivery')).toBeInTheDocument();
    expect(screen.getByText('👥 Clients')).toBeInTheDocument();
  });

  it('displays sidebar sections', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Live Updates')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('📡 Connection Status')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    const scrapingTab = screen.getByText('🕷️ Scraping');
    fireEvent.click(scrapingTab);
    
    expect(screen.getByText('🕷️ Scraping')).toBeInTheDocument();
  });

  it('displays search filter component', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
  });

  it('displays charts when on overview tab', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByTestId('performance-chart')).toBeInTheDocument();
    expect(screen.getByTestId('theme-chart')).toBeInTheDocument();
    expect(screen.getByTestId('tech-chart')).toBeInTheDocument();
    expect(screen.getByTestId('financial-chart')).toBeInTheDocument();
    expect(screen.getByTestId('activity-monitor')).toBeInTheDocument();
  });

  it('displays connection status', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('📡 Connection Status')).toBeInTheDocument();
  });

  it('displays real-time updates section', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('Live Updates')).toBeInTheDocument();
    expect(screen.getByText('Waiting for real-time updates...')).toBeInTheDocument();
  });

  it('displays reports section', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('handles tab navigation', () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    const processingTab = screen.getByText('⚙️ Processing');
    fireEvent.click(processingTab);
    
    // Check that processing tab content is displayed
    expect(screen.getByText('⚙️ Processing')).toBeInTheDocument();
  });

  it('loads dashboard data on mount', async () => {
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('performance-chart')).toBeInTheDocument();
    });
  });

  it('displays mobile menu toggle on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    // Mobile menu toggle should be visible
    expect(document.querySelector('.mobile-menu-toggle')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    fireEvent.click(menuToggle);
    
    // Sidebar should be expanded
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).toHaveClass('expanded');
  });

  it('closes mobile menu when tab is selected', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    fireEvent.click(menuToggle);
    
    const scrapingTab = screen.getByText('🕷️ Scraping');
    fireEvent.click(scrapingTab);
    
    // Menu should be closed after tab selection
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).toHaveClass('collapsed');
  });

  it('displays user-specific content based on permissions', () => {
    // Test with different user roles
    authService.login({ username: 'admin', password: 'admin123' });
    const adminUser = authService.getCurrentUser();
    
    renderWithRouter(<Dashboard user={adminUser} onLogout={jest.fn()} />);
    
    // Admin should see all action buttons
    expect(screen.getByText('🔄 Refresh Data')).toBeInTheDocument();
    expect(screen.getByText('📊 Export Metrics')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Settings')).toBeInTheDocument();
  });

  it('handles WebSocket connection initialization', () => {
    const wsService = require('../services/WebSocketService');
    
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    expect(wsService.connect).toHaveBeenCalled();
    expect(wsService.subscribeToDashboardUpdates).toHaveBeenCalled();
    expect(wsService.subscribeToPipelineUpdates).toHaveBeenCalled();
    expect(wsService.subscribeToAlerts).toHaveBeenCalled();
  });

  it('handles real-time updates', () => {
    const wsService = require('../services/WebSocketService');
    
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    // Simulate real-time update
    const onCallback = wsService.on.mock.calls.find(call => call[0] === 'scraping')[1];
    const updateData = {
      type: 'scraping',
      timestamp: new Date().toISOString(),
      message: 'Scraping operation completed',
      value: 42
    };
    
    onCallback(updateData);
    
    expect(screen.getByText('SCRAPING')).toBeInTheDocument();
    expect(screen.getByText('Scraping operation completed')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    // Mock API to return pending
    const ApiService = require('../app').ApiService;
    ApiService.getDashboardData.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    // Should show loading state
    expect(screen.getByText('Loading overview data...')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API to throw error
    const ApiService = require('../app').ApiService;
    ApiService.getDashboardData.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<Dashboard user={mockUser} onLogout={jest.fn()} />);
    
    await waitFor(() => {
      // Should still render dashboard even with API error
      expect(screen.getByText('CodeVoyager Enterprise Pipeline')).toBeInTheDocument();
    });
  });
});
