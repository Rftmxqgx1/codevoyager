import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchFilter from '../SearchFilter';

describe('SearchFilter Component', () => {
  const mockOnFilter = jest.fn();
  const mockData = {
    scraping: { totalScraped: 1247, successRate: 98.8 },
    processing: { totalProcessed: 1247, qualityScore: 96.2 }
  };

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it('renders without crashing', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
  });

  it('displays search input', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    expect(screen.getByPlaceholderText('Search scraping...')).toBeInTheDocument();
  });

  it('displays filter dropdowns', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    expect(screen.getByText('Order')).toBeInTheDocument();
  });

  it('calls onFilter when search input changes', async () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const searchInput = screen.getByPlaceholderText('Search scraping...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: 'test search' })
      );
    });
  });

  it('calls onFilter when status filter changes', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const statusSelect = screen.getByDisplayValue('All');
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active' })
    );
  });

  it('calls onFilter when category filter changes', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const categorySelect = screen.getByDisplayValue('All');
    fireEvent.change(categorySelect, { target: { value: 'e-commerce' } });

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'e-commerce' })
    );
  });

  it('calls onFilter when date range filter changes', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const dateRangeSelect = screen.getByDisplayValue('All Time');
    fireEvent.change(dateRangeSelect, { target: { value: 'today' } });

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ dateRange: 'today' })
    );
  });

  it('calls onFilter when sort by filter changes', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const sortBySelect = screen.getByDisplayValue('Recent');
    fireEvent.change(sortBySelect, { target: { value: 'url' } });

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'url' })
    );
  });

  it('calls onFilter when sort order changes', () => {
    render(<SearchFilter onFilter={mockOnFilter} data={mockData} type="scraping" />);
    
    const sortOrderSelect = screen.getByDisplayValue('Descending');
    fireEvent.change(sortOrderSelect, { target: { value: 'asc' } });

    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({ sortOrder: 'asc' })
    );
  });

  it('displays active filters', () => {
    render(
      <SearchFilter 
        onFilter={mockOnFilter} 
        data={mockData} 
        type="scraping" 
      />
    );
    
    // Change some filters to see active filters display
    const statusSelect = screen.getByDisplayValue('All');
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    expect(screen.getByText(/Active Filters:/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: active/i)).toBeInTheDocument();
  });

  it('handles different data types correctly', () => {
    const { rerender } = render(
      <SearchFilter onFilter={mockOnFilter} data={mockData} type="processing" />
    );
    
    expect(screen.getByPlaceholderText('Search processing...')).toBeInTheDocument();
    
    rerender(
      <SearchFilter onFilter={mockOnFilter} data={mockData} type="clients" />
    );
    
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    render(
      <SearchFilter onFilter={mockOnFilter} data={null} type="scraping" />
    );
    
    expect(screen.getByText('🔍 Advanced Search & Filters')).toBeInTheDocument();
  });
});
