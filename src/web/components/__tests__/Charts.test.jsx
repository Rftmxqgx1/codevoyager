import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PerformanceChart, ThemeDistributionChart, TechnologyChart, FinancialChart, ActivityMonitor } from '../Charts';

// Mock data for testing
const mockData = {
  performance: [
    { time: '00:00', responseTime: 1150, throughput: 1247 },
    { time: '04:00', responseTime: 1080, throughput: 1356 },
    { time: '08:00', responseTime: 1250, throughput: 1189 }
  ],
  themes: [
    { name: 'E-Commerce', value: 342, color: '#1976d2' },
    { name: 'SaaS', value: 287, color: '#4caf50' }
  ],
  technologies: [
    { name: 'React', count: 445, growth: 12 },
    { name: 'Vue', count: 234, growth: 8 }
  ],
  financial: [
    { month: 'Jan', investment: 230000, returns: 180000, roi: 22 },
    { month: 'Feb', investment: 245000, returns: 210000, roi: 24 }
  ],
  activity: [
    { time: '12:00', scraping: 45, processing: 23, creation: 12, delivery: 8 },
    { time: '12:05', scraping: 52, processing: 28, creation: 15, delivery: 11 }
  ]
};

describe('Charts Components', () => {
  describe('PerformanceChart', () => {
    it('renders without crashing', () => {
      render(<PerformanceChart data={mockData} />);
    });

    it('displays chart title', () => {
      render(<PerformanceChart data={mockData} />);
      expect(screen.getByText('📈 Performance Trends')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<PerformanceChart data={null} />);
      expect(screen.getByText('📈 Performance Trends')).toBeInTheDocument();
    });
  });

  describe('ThemeDistributionChart', () => {
    it('renders without crashing', () => {
      render(<ThemeDistributionChart data={mockData} />);
    });

    it('displays chart title', () => {
      render(<ThemeDistributionChart data={mockData} />);
      expect(screen.getByText('🎨 Theme Distribution')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<ThemeDistributionChart data={null} />);
      expect(screen.getByText('🎨 Theme Distribution')).toBeInTheDocument();
    });
  });

  describe('TechnologyChart', () => {
    it('renders without crashing', () => {
      render(<TechnologyChart data={mockData} />);
    });

    it('displays chart title', () => {
      render(<TechnologyChart data={mockData} />);
      expect(screen.getByText('⚡ Technology Stack Analysis')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<TechnologyChart data={null} />);
      expect(screen.getByText('⚡ Technology Stack Analysis')).toBeInTheDocument();
    });
  });

  describe('FinancialChart', () => {
    it('renders without crashing', () => {
      render(<FinancialChart data={mockData} />);
    });

    it('displays chart title', () => {
      render(<FinancialChart data={mockData} />);
      expect(screen.getByText('💰 Financial Performance')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<FinancialChart data={null} />);
      expect(screen.getByText('💰 Financial Performance')).toBeInTheDocument();
    });
  });

  describe('ActivityMonitor', () => {
    it('renders without crashing', () => {
      render(<ActivityMonitor data={mockData} />);
    });

    it('displays chart title', () => {
      render(<ActivityMonitor data={mockData} />);
      expect(screen.getByText('🔄 Real-time Activity Monitor')).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
      render(<ActivityMonitor data={null} />);
      expect(screen.getByText('🔄 Real-time Activity Monitor')).toBeInTheDocument();
    });
  });
});
