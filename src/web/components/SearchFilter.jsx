import React, { useState, useEffect, memo, useCallback } from 'react';

const SearchFilter = memo(({ onFilter, data, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    category: 'all',
    sortBy: 'recent',
    sortOrder: 'desc'
  });

  // Debounced search using useCallback and useEffect
  const debouncedSearch = useCallback((searchValue, currentFilters) => {
    onFilter({ ...currentFilters, searchTerm: searchValue });
  }, [onFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm, filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, debouncedSearch]); // Added filters to dependencies

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    // Removed immediate onFilter call - let debounce handle it
  };

  const getFilterOptions = () => {
    switch(type) {
      case 'scraping':
        return {
          status: ['all', 'active', 'completed', 'failed', 'paused'],
          category: ['all', 'e-commerce', 'saas', 'corporate', 'portfolio', 'blog'],
          sortBy: ['recent', 'url', 'status', 'success_rate'],
          sortOrder: ['asc', 'desc']
        };
      case 'processing':
        return {
          status: ['all', 'processing', 'completed', 'failed'],
          category: ['all', 'theme_classification', 'pattern_detection', 'quality_check'],
          sortBy: ['recent', 'quality_score', 'processing_time', 'theme'],
          sortOrder: ['asc', 'desc']
        };
      case 'creation':
        return {
          status: ['all', 'generating', 'completed', 'failed'],
          category: ['all', 'website_template', 'mobile_app', 'component_library'],
          sortBy: ['recent', 'asset_type', 'quality_score', 'generation_time'],
          sortOrder: ['asc', 'desc']
        };
      case 'delivery':
        return {
          status: ['all', 'preparing', 'deploying', 'completed', 'failed'],
          category: ['all', 'automated', 'manual', 'staging', 'production'],
          sortBy: ['recent', 'deployment_time', 'success_rate', 'security_score'],
          sortOrder: ['asc', 'desc']
        };
      case 'clients':
        return {
          status: ['all', 'active', 'inactive', 'trial', 'premium'],
          category: ['all', 'enterprise', 'small_business', 'individual'],
          sortBy: ['recent', 'name', 'project_count', 'revenue', 'satisfaction'],
          sortOrder: ['asc', 'desc']
        };
      default:
        return {
          status: ['all', 'active', 'inactive'],
          category: ['all'],
          sortBy: ['recent', 'name'],
          sortOrder: ['asc', 'desc']
        };
    }
  };

  const filterOptions = getFilterOptions();

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      backgroundColor: '#f9f9f9',
      marginBottom: '20px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>🔍 Advanced Search & Filters</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        {/* Search Input */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Search
          </label>
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            {filterOptions.status.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            {filterOptions.category.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            {filterOptions.sortBy.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            {filterOptions.sortOrder.map(option => (
              <option key={option} value={option}>
                {option === 'asc' ? 'Ascending' : 'Descending'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1565c0'
      }}>
        <strong>Active Filters:</strong> 
        {searchTerm && ` Search: "${searchTerm}"`}
        {filters.status !== 'all' && ` Status: ${filters.status}`}
        {filters.category !== 'all' && ` Category: ${filters.category}`}
        {filters.dateRange !== 'all' && ` Date: ${filters.dateRange}`}
        {filters.sortBy !== 'recent' && ` Sort: ${filters.sortBy} ${filters.sortOrder}`}
      </div>
    </div>
  );
});

export default SearchFilter;
