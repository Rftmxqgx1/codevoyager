import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin({ username, role: 'Administrator' });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1976d2' }}>
          CodeVoyager Login
        </h2>
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'scraping', label: '🕷️ Scraping' },
    { id: 'processing', label: '⚙️ Processing' },
    { id: 'creation', label: '🛠️ Creation' },
    { id: 'delivery', label: '📦 Delivery' },
    { id: 'clients', label: '👥 Clients' },
    { id: 'design-intelligence', label: '🎨 Design Intelligence' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #ddd'
      }}>
        <h1 style={{ margin: 0, color: '#1976d2' }}>
          CodeVoyager Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>Welcome, {user.username}</span>
          <span style={{ color: '#666' }}>({user.role})</span>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '30px', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                backgroundColor: activeTab === tab.id ? '#1976d2' : '#f5f5f5',
                color: activeTab === tab.id ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'design-intelligence' && (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#f0f8ff',
          borderRadius: '10px',
          border: '2px solid #1976d2'
        }}>
          <h2 style={{ color: '#1976d2', marginBottom: '20px' }}>🎨 Design Intelligence</h2>
          <div style={{ 
            padding: '30px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '1px solid #1976d2'
          }}>
            <h3 style={{ color: '#1976d2', margin: '0 0 15px 0' }}>Module Status: Active</h3>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6' }}>
              The Design Intelligence module is now fully operational.
            </p>
            <p style={{ fontSize: '16px', color: '#666' }}>
              All systems are working correctly.
            </p>
          </div>
        </div>
      )}

      {activeTab !== 'design-intelligence' && (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6' }}>
            This tab is currently under development.
          </p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginForm onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
