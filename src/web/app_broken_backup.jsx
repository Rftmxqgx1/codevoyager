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
  const [activeTab, setActiveTab] = useState('design-intelligence');
  const [designIntelligenceSubTab, setDesignIntelligenceSubTab] = useState('scraping');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'scraping', label: '🕷️ Scraping', icon: '🕷️' },
    { id: 'processing', label: '⚙️ Processing', icon: '⚙️' },
    { id: 'creation', label: '🛠️ Creation', icon: '🛠️' },
    { id: 'delivery', label: '📦 Delivery', icon: '📦' },
    { id: 'clients', label: '👥 Clients', icon: '👥' },
    { id: 'design-intelligence', label: '🎨 Design Intelligence', icon: '🎨' }
  ];

  const systemStatus = {
    database: { status: 'Connected', color: '#4caf50', details: 'PostgreSQL + Vector DB' },
    websocket: { status: 'Connected', color: '#4caf50', details: 'Real-time updates active' },
    agents: { status: 'Active', color: '#4caf50', details: '7 agents operational' },
    memory: { status: 'Healthy', color: '#4caf50', details: '45% usage' },
    cpu: { status: 'Normal', color: '#4caf50', details: '32% usage' },
    storage: { status: 'Available', color: '#4caf50', details: '2.3TB free' }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Left Sidebar */}
      <div style={{
        width: sidebarExpanded ? '280px' : '60px',
        backgroundColor: '#2c3e50',
        color: 'white',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarExpanded && <h3 style={{ margin: 0, fontSize: '18px' }}>CodeVoyager</h3>}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              {sidebarExpanded ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: sidebarExpanded ? '15px 20px' : '15px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: sidebarExpanded ? '10px' : '0',
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                transition: 'background-color 0.3s ease'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {sidebarExpanded && <span>{tab.label}</span>}
            </button>
          ))}
        </div>

        {/* System Status Monitor */}
        {sidebarExpanded && (
          <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#ecf0f1' }}>System Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: status.color
                  }}></div>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{key}</div>
                    <div style={{ color: '#bdc3c7', fontSize: '10px' }}>{status.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
          {sidebarExpanded && (
            <div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>{user.username}</div>
              <div style={{ fontSize: '12px', color: '#bdc3c7' }}>{user.role}</div>
            </div>
          )}
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: sidebarExpanded ? '10px' : '0'
            }}
          >
            {sidebarExpanded ? 'Logout' : '⬆'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 30px', 
          borderBottom: '1px solid #ddd',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#1976d2' }}>
            {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666' }}>Welcome, {user.username}</span>
            <span style={{ color: '#666' }}>({user.role})</span>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '30px' }}>
          {designIntelligenceSubTab === 'scraping' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Design Intelligence Scraper - DNA Extraction Pipeline</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', margin: '0 auto' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>RecordID</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Year</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Site</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Visual Palette</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Contrast Ratio</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>UX Flow Metric</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Conversion Logic</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Rendering Engine</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>CSS Methodology</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Web Vitals</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Literature Link</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Peer Review</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      recordId: 'DES-001', 
                      year: 2014, 
                      site: 'example.com', 
                      palette: '#4285F4,#DB4437,#F4B400,#0F9D58', 
                      contrast: '7.2:1', 
                      uxFlow: 'Linear onboarding', 
                      conversion: 'CTA-first funnel', 
                      engine: 'GSAP', 
                      css: 'Tailwind', 
                      vitals: 'LCP:2.1s,FID:45ms,CLS:0.05', 
                      literature: 'NNg:MobileFirst', 
                      peerReview: 'Awwwards',
                      period: '2014 Foundation',
                      lastRun: new Date(Date.now() - 3600000).toISOString(),
                      outcome: 'Successfully extracted Material Design DNA',
                      nextRun: new Date(Date.now() + 3600000).toISOString()
                    },
                    { 
                      recordId: 'DES-002', 
                      year: 2016, 
                      site: 'example.org', 
                      palette: '#1A1A1A,#FFFFFF,#FF6F61,#6B5B95', 
                      contrast: '6.8:1', 
                      uxFlow: 'Grid navigation', 
                      conversion: 'Multi-step checkout', 
                      engine: 'GSAP+GSAP.timeline', 
                      css: 'Styled Components', 
                      vitals: 'LCP:2.5s,FID:60ms,CLS:0.08', 
                      literature: 'IEEE:ColorTheory', 
                      peerReview: 'FWA',
                      period: '2015-2020 Timeline',
                      lastRun: new Date(Date.now() - 7200000).toISOString(),
                      outcome: 'Timeline sequencing patterns identified',
                      nextRun: new Date(Date.now() + 7200000).toISOString()
                    },
                    { 
                      recordId: 'DES-003', 
                      year: 2021, 
                      site: 'example.net', 
                      palette: '#0D0D0D,#EAEAEA,#FFB400,#009688', 
                      contrast: '8.0:1', 
                      uxFlow: 'Bento grid', 
                      conversion: 'Micro-interaction funnel', 
                      engine: 'React Three Fiber', 
                      css: 'Tailwind', 
                      vitals: 'LCP:1.9s,FID:40ms,CLS:0.02', 
                      literature: 'NNg:MicroInteractions', 
                      peerReview: 'Behance',
                      period: '2021-Present Modern',
                      lastRun: new Date(Date.now() - 1800000).toISOString(),
                      outcome: 'Modern core ScrollTrigger narratives captured',
                      nextRun: new Date(Date.now() + 1800000).toISOString()
                    },
                    { 
                      recordId: 'DES-004', 
                      year: 2025, 
                      site: 'example.ai', 
                      palette: '#101820,#FEE715,#00A4CC,#F95700', 
                      contrast: '7.5:1', 
                      uxFlow: 'Generative UI', 
                      conversion: 'Adaptive personalization', 
                      engine: 'Spline+Three.js', 
                      css: 'Tailwind', 
                      vitals: 'LCP:1.7s,FID:35ms,CLS:0.01', 
                      literature: 'W3C:Accessibility', 
                      peerReview: 'Awwwards',
                      period: '2026 Horizon',
                      lastRun: new Date(Date.now() - 10800000).toISOString(),
                      outcome: 'AI-native interface patterns archived',
                      nextRun: new Date(Date.now() + 10800000).toISOString()
                    }
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.recordId}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.year}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.site}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {item.palette.split(',').map((color, i) => (
                            <div key={i} style={{ 
                              width: '20px', 
                              height: '20px', 
                              backgroundColor: color, 
                              border: '1px solid #ddd',
                              borderRadius: '2px'
                            }}></div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.contrast}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.uxFlow}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.conversion}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.engine}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.css}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '12px' }}>{item.vitals}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.literature}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.peerReview}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <button
                          onClick={() => alert(`Starting DNA extraction for ${item.site} (${item.period})`)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Extract DNA
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {designIntelligenceSubTab === 'ui-adaptation' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>UI Adaptation Log - Database-Driven Re-skinning</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', margin: '0 auto' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>AdaptationID</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Timestamp</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Palette</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Layout</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Component</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Change Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Rationale</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Outcome</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Linkage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      id: 'UI-001', 
                      timestamp: '14:45', 
                      palette: '#4285F4,#DB4437,#F4B400,#0F9D58', 
                      layout: 'Login Screen', 
                      component: 'Theme Swap', 
                      changeType: 'Theme Swap', 
                      rationale: 'Align with 2014 Material baseline', 
                      outcome: 'UI refreshed with legacy palette', 
                      linkage: 'design_intelligence_scraper.csv'
                    },
                    { 
                      id: 'UI-002', 
                      timestamp: '14:50', 
                      palette: '#1A1A1A,#FFFFFF,#FF6F61,#6B5B95', 
                      layout: 'Grid Layout', 
                      component: 'Responsive Reflow', 
                      changeType: 'Responsive Reflow', 
                      rationale: 'Optimize for 2016 timeline sequencing', 
                      outcome: 'Grid stabilized with GPU transforms', 
                      linkage: 'design_intelligence_scraper.csv'
                    },
                    { 
                      id: 'UI-003', 
                      timestamp: '14:55', 
                      palette: '#0D0D0D,#EAEAEA,#FFB400,#009688', 
                      layout: 'Bento Grid', 
                      component: 'Micro-Interaction', 
                      changeType: 'Micro-Interaction', 
                      rationale: 'Adopt 2021 modern core', 
                      outcome: 'UI enhanced with ScrollTrigger narratives', 
                      linkage: 'design_intelligence_scraper.csv'
                    },
                    { 
                      id: 'UI-004', 
                      timestamp: '15:00', 
                      palette: '#101820,#FEE715,#00A4CC,#F95700', 
                      layout: 'Adaptive Layout', 
                      component: 'Generative UI', 
                      changeType: 'Generative UI', 
                      rationale: 'Prepare for 2026 horizon', 
                      outcome: 'UI re-skinned with AI-native design', 
                      linkage: 'design_intelligence_scraper.csv'
                    },
                    { 
                      id: 'UI-005', 
                      timestamp: '15:05', 
                      palette: '#2E3440,#D8DEE9,#88C0D0,#EBCB8B', 
                      layout: 'Dark Theme', 
                      component: 'Accessibility', 
                      changeType: 'Accessibility Enhancement', 
                      rationale: 'Improve contrast for WCAG compliance', 
                      outcome: 'Accessibility score improved to AA rating', 
                      linkage: 'design_intelligence_scraper.csv'
                    }
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.id}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.timestamp}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                          {item.palette.split(',').map((color, i) => (
                            <div key={i} style={{ 
                              width: '16px', 
                              height: '16px', 
                              backgroundColor: color, 
                              border: '1px solid #ddd',
                              borderRadius: '2px'
                            }}></div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.layout}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.component}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.changeType}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.rationale}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: item.outcome.includes('improved') || item.outcome.includes('enhanced') ? '#e8f5e8' : '#f5f5f5',
                          color: item.outcome.includes('improved') || item.outcome.includes('enhanced') ? '#2e7d32' : '#333'
                        }}>
                          {item.outcome}
                        </span>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>View CSV</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {designIntelligenceSubTab === 'swarm-agents' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Swarm Agent Assignment Log - Pipeline Flow Agents</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', justifyContent: 'center' }}>
                {[
                  { 
                    agentId: 'AGT-001', 
                    role: 'Sifting Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Same as creation agents', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'pattern-recognition;data-mining;performance-analysis', 
                    description: 'Identify design DNA, GSAP usage, performance markers', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 96.71,
                    currentFunction: 'Discovery & Sifting'
                  },
                  { 
                    agentId: 'AGT-002', 
                    role: 'Deciphering Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Same as creation agents', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'logic-mapping;accessibility-validation;motion-analysis', 
                    description: 'Map vibes → reproducible logic, validate easing and accessibility', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 97.78,
                    currentFunction: 'Deciphering Logic'
                  },
                  { 
                    agentId: 'AGT-003', 
                    role: 'Classification Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Same as creation agents', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'era-classification;academic-validation;taxonomy-organization', 
                    description: 'Organize by era, validate academic compliance', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 99.03,
                    currentFunction: 'Classification & Archiving'
                  },
                  { 
                    agentId: 'AGT-004', 
                    role: 'Archiving Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Same as creation agents', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'database-archival;vector-embedding;data-integrity', 
                    description: 'Archive into PostgreSQL + Vector DB, maintain data integrity', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 97.87,
                    currentFunction: 'Archiving & Storage'
                  },
                  { 
                    agentId: 'AGT-005', 
                    role: 'Creation Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Same as creation agents', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'export-generation;timeline-creation;demo-preparation', 
                    description: 'Generate structured exports, build demo-ready timelines', 
                    status: 'ready', 
                    tasksCompleted: 0, 
                    accuracy: 97.82,
                    currentFunction: 'Creation & Export'
                  },
                  { 
                    agentId: 'AGT-006', 
                    role: 'Verification Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Performance redline checks', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'performance-validation;accessibility-checks;plugin-integrity', 
                    description: 'Performance redline, accessibility fallback, plugin registration', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 98.45,
                    currentFunction: 'Verification & QA'
                  },
                  { 
                    agentId: 'AGT-007', 
                    role: 'UI Adaptation Agent', 
                    period: '2014', 
                    cadence: 'Every 6h', 
                    limitations: 'Database-driven re-skinning', 
                    linkage: 'design_intelligence_scraper.csv', 
                    capabilities: 'palette-application;layout-adaptation;component-modification', 
                    description: 'Apply palettes, layouts, components from DB with rationale', 
                    status: 'ready', 
                    tasksCompleted: 1, 
                    accuracy: 96.92,
                    currentFunction: 'UI Adaptation'
                  }
                ].map((agent, idx) => (
                  <div key={idx} style={{ 
                    padding: '20px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    backgroundColor: '#f9f9f9' 
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
                      {agent.agentId} - {agent.role}
                    </h4>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Period:</strong> {agent.period}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Cadence:</strong> {agent.cadence}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Status:</strong> {agent.status}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Current Function:</strong> {agent.currentFunction}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Tasks Completed:</strong> {agent.tasksCompleted}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Accuracy:</strong> {agent.accuracy}%
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Capabilities:</strong> {agent.capabilities}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {designIntelligenceSubTab === 'training-progress' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Agent Training Progress - Continuous Learning Pipeline</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', margin: '0 auto' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>AgentID</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Training Module</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>GSAP Modules</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Fit for Duty</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Accuracy</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Last Updated</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Next Session</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      agentId: 'AGT-001', 
                      role: 'Sifting Agent', 
                      trainingModule: 'Pattern Recognition & Data Mining', 
                      gsapModules: ['Discovery', 'Core Tweens'], 
                      status: 'Completed', 
                      fitForDuty: true, 
                      accuracy: 96.71,
                      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
                      scheduledSession: new Date(Date.now() + 3600000).toISOString()
                    },
                    { 
                      agentId: 'AGT-002', 
                      role: 'Deciphering Agent', 
                      trainingModule: 'Logic Mapping & Accessibility', 
                      gsapModules: ['Deciphering', 'Accessibility'], 
                      status: 'In Progress', 
                      fitForDuty: false, 
                      accuracy: 97.78,
                      lastUpdated: new Date(Date.now() - 7200000).toISOString(),
                      scheduledSession: new Date(Date.now() + 7200000).toISOString()
                    },
                    { 
                      agentId: 'AGT-003', 
                      role: 'Classification Agent', 
                      trainingModule: 'Era Classification & Academic Validation', 
                      gsapModules: ['Classification', 'Academic Standards'], 
                      status: 'Completed', 
                      fitForDuty: true, 
                      accuracy: 99.03,
                      lastUpdated: new Date(Date.now() - 1800000).toISOString(),
                      scheduledSession: new Date(Date.now() + 1800000).toISOString()
                    },
                    { 
                      agentId: 'AGT-004', 
                      role: 'Archiving Agent', 
                      trainingModule: 'Database Archival & Vector Embedding', 
                      gsapModules: ['Archiving', 'Vector Storage'], 
                      status: 'Completed', 
                      fitForDuty: true, 
                      accuracy: 97.87,
                      lastUpdated: new Date(Date.now() - 10800000).toISOString(),
                      scheduledSession: new Date(Date.now() + 10800000).toISOString()
                    },
                    { 
                      agentId: 'AGT-005', 
                      role: 'Creation Agent', 
                      trainingModule: 'Export Generation & Timeline Creation', 
                      gsapModules: ['Creation', 'Timeline'], 
                      status: 'Not Started', 
                      fitForDuty: false, 
                      accuracy: 97.82,
                      lastUpdated: new Date(Date.now() - 14400000).toISOString(),
                      scheduledSession: new Date(Date.now() + 14400000).toISOString()
                    },
                    { 
                      agentId: 'AGT-006', 
                      role: 'Verification Agent', 
                      trainingModule: 'Performance Validation & QA', 
                      gsapModules: ['Verification', 'Performance'], 
                      status: 'In Progress', 
                      fitForDuty: false, 
                      accuracy: 98.45,
                      lastUpdated: new Date(Date.now() - 21600000).toISOString(),
                      scheduledSession: new Date(Date.now() + 21600000).toISOString()
                    },
                    { 
                      agentId: 'AGT-007', 
                      role: 'UI Adaptation Agent', 
                      trainingModule: 'Palette Application & Layout Adaptation', 
                      gsapModules: ['UI Adaptation', 'Component Modification'], 
                      status: 'Completed', 
                      fitForDuty: true, 
                      accuracy: 96.92,
                      lastUpdated: new Date(Date.now() - 28800000).toISOString(),
                      scheduledSession: new Date(Date.now() + 28800000).toISOString()
                    }
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.agentId}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.role}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.trainingModule}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.gsapModules.join(', ')}</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: item.status === 'Completed' ? '#e8f5e8' : item.status === 'In Progress' ? '#fff3e0' : '#f5f5f5',
                          color: item.status === 'Completed' ? '#2e7d32' : item.status === 'In Progress' ? '#f57c00' : '#333'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: item.fitForDuty ? '#e8f5e8' : '#f5f5f5',
                          color: item.fitForDuty ? '#2e7d32' : '#333'
                        }}>
                          {item.fitForDuty ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.accuracy}%</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'Never'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {item.scheduledSession ? new Date(item.scheduledSession).toLocaleString() : 'Not scheduled'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              onClick={() => alert('Design Intelligence pipeline refreshed! All agents ready for DNA extraction.')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Refresh Pipeline Status
            </button>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>📊 Dashboard Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>System Status</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>Operational</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>All systems running normally</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Active Scrapes</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>156</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total completed operations</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Business Value</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>$2,847,392</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total value enabled</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Response Time</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>245ms</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Average response time</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scraping' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>🕷️ Web Scraping</h2>
          <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Scraper Control Panel</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Enter URL to scrape..."
                style={{
                  flex: '1',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <button
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Start Scraping
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {[
                { site: 'dribbble.com', status: 'Completed', items: 247, lastRun: '2 hours ago' },
                { site: 'behance.net', status: 'In Progress', items: 156, lastRun: '1 hour ago' },
                { site: 'awwwards.com', status: 'Pending', items: 0, lastRun: 'Never' }
              ].map((site, idx) => (
                <div key={idx} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>{site.site}</h4>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    <strong>Status:</strong> {site.status}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    <strong>Items:</strong> {site.items}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    <strong>Last Run:</strong> {site.lastRun}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'processing' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>⚙️ Data Processing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Processing Queue</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>23</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Items awaiting processing</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Processing Speed</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>1,247</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Items per minute</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Quality Score</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>94.7%</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Average quality rating</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creation' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>🛠️ Content Creation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Generated Content</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>1,847</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total items created</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Templates Used</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>234</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Active templates</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Media Library</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>3,421</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Media assets available</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'delivery' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>📦 Content Delivery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Deliveries Today</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>47</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Completed deliveries</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Success Rate</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>98.3%</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Delivery success rate</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Active Channels</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>12</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Delivery channels active</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>👥 Client Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Clients</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>156</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Active client accounts</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>New This Month</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>23</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>New clients added</p>
            </div>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Retention Rate</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>92.4%</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Client retention rate</p>
            </div>
          </div>
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
