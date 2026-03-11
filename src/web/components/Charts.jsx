import React, { memo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Performance Line Chart
const PerformanceChart = memo(({ data }) => {
  const performanceData = Array.isArray(data?.performance) ? data.performance : [
    { time: '00:00', responseTime: 1150, throughput: 1247 },
    { time: '04:00', responseTime: 1080, throughput: 1356 },
    { time: '08:00', responseTime: 1250, throughput: 1189 },
    { time: '12:00', responseTime: 980, throughput: 1456 },
    { time: '16:00', responseTime: 1120, throughput: 1298 },
    { time: '20:00', responseTime: 1050, throughput: 1389 },
    { time: '23:59', responseTime: 1180, throughput: 1267 }
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>📈 Performance Trends</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="responseTime" 
            stroke="#1976d2" 
            strokeWidth={2}
            name="Response Time (ms)"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="throughput" 
            stroke="#4caf50" 
            strokeWidth={2}
            name="Throughput (items/hr)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

// Theme Distribution Pie Chart
const ThemeDistributionChart = memo(({ data }) => {
  const themeData = Array.isArray(data?.themes) ? data.themes : 
    (data?.themes && typeof data.themes === 'object') ? 
      Object.entries(data.themes).map(([name, themeInfo]) => ({
        name,
        value: themeInfo.count || 0,
        color: '#1976d2' // Default color, can be enhanced with theme-specific colors
      })) : [
      { name: 'E-Commerce', value: 342, color: '#1976d2' },
      { name: 'SaaS', value: 287, color: '#4caf50' },
      { name: 'Corporate', value: 198, color: '#ff9800' },
      { name: 'Portfolio', value: 156, color: '#9c27b0' },
      { name: 'Blog/Media', value: 134, color: '#f44336' },
      { name: 'Other', value: 230, color: '#607d8b' }
    ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>🎨 Theme Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={themeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {themeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

// Technology Stack Bar Chart
const TechnologyChart = memo(({ data }) => {
  const techData = Array.isArray(data?.technologies) ? data.technologies : 
    (data?.technologies && typeof data.technologies === 'object') ? 
      Object.entries(data.technologies).map(([name, techInfo]) => ({
        name,
        count: techInfo.count || 0,
        growth: techInfo.growth || 0
      })) : [
      { name: 'React', count: 445, growth: 12 },
      { name: 'Vue', count: 234, growth: 8 },
      { name: 'Angular', count: 189, growth: -2 },
      { name: 'WordPress', count: 567, growth: 15 },
      { name: 'Shopify', count: 234, growth: 18 },
      { name: 'Custom', count: 445, growth: 5 }
    ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>⚡ Technology Stack Analysis</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={techData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#1976d2" name="Usage Count" />
          <Bar dataKey="growth" fill="#4caf50" name="Growth %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

// Financial Metrics Area Chart
const FinancialChart = memo(({ data }) => {
  const financialData = Array.isArray(data?.financial) ? data.financial : [
    { month: 'Jan', investment: 230000, returns: 180000, roi: 22 },
    { month: 'Feb', investment: 245000, returns: 210000, roi: 24 },
    { month: 'Mar', investment: 260000, returns: 285000, roi: 28 },
    { month: 'Apr', investment: 275000, returns: 320000, roi: 31 },
    { month: 'May', investment: 290000, returns: 355000, roi: 35 },
    { month: 'Jun', investment: 310000, returns: 390500, roi: 38 }
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>💰 Financial Performance</h4>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={financialData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="investment" 
            stackId="1"
            stroke="#ff9800" 
            fill="#ff9800" 
            fillOpacity={0.6}
            name="Investment ($)"
          />
          <Area 
            type="monotone" 
            dataKey="returns" 
            stackId="2"
            stroke="#4caf50" 
            fill="#4caf50" 
            fillOpacity={0.6}
            name="Returns ($)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

// Real-time Activity Monitor
const ActivityMonitor = memo(({ data }) => {
  const activityData = Array.isArray(data?.activity) ? data.activity : [
    { time: '12:00', scraping: 45, processing: 23, creation: 12, delivery: 8 },
    { time: '12:05', scraping: 52, processing: 28, creation: 15, delivery: 11 },
    { time: '12:10', scraping: 48, processing: 31, creation: 18, delivery: 14 },
    { time: '12:15', scraping: 58, processing: 25, creation: 20, delivery: 9 },
    { time: '12:20', scraping: 62, processing: 35, creation: 22, delivery: 16 },
    { time: '12:25', scraping: 55, processing: 29, creation: 25, delivery: 13 }
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>🔄 Real-time Activity Monitor</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="scraping" stroke="#4caf50" strokeWidth={2} name="Scraping" />
          <Line type="monotone" dataKey="processing" stroke="#ff9800" strokeWidth={2} name="Processing" />
          <Line type="monotone" dataKey="creation" stroke="#9c27b0" strokeWidth={2} name="Creation" />
          <Line type="monotone" dataKey="delivery" stroke="#f44336" strokeWidth={2} name="Delivery" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export {
  PerformanceChart,
  ThemeDistributionChart,
  TechnologyChart,
  FinancialChart,
  ActivityMonitor
};
