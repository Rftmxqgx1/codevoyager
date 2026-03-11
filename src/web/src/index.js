import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

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
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [interventionActions, setInterventionActions] = useState([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState(null);
  const [showMultiAgentReplayModal, setShowMultiAgentReplayModal] = useState(false);
  const [multiAgentData, setMultiAgentData] = useState(null);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [showHRChatBot, setShowHRChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Store last 5 chats
  const [showHistory, setShowHistory] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [systemStatus, setSystemStatus] = useState({
    database: { status: 'on', reason: 'All connections stable', color: '#4caf50', details: 'PostgreSQL + Vector DB' },
    websocket: { status: 'on', reason: 'Real-time updates active', color: '#4caf50', details: 'Real-time updates active' },
    agents: { status: 'on', reason: 'All 7 agents operational', color: '#4caf50', details: '7 agents operational' },
    memory: { status: 'on', reason: 'Memory usage within limits', color: '#4caf50', details: '45% usage' },
    cpu: { status: 'on', reason: 'CPU load normal', color: '#4caf50', details: '32% usage' },
    storage: { status: 'on', reason: 'Sufficient storage available', color: '#4caf50', details: '2.3TB free' }
  });

  // Real-time data states
  const [scrapeData, setScrapeData] = useState([
    { recordId: 'DES-001', site: 'dribbble.com', era: '2021-Present', status: 'Active', lastRun: new Date(Date.now() - 3600000).toISOString(), dnaExtracted: 247, errors: 0 },
    { recordId: 'DES-002', site: 'behance.net', era: '2021-Present', status: 'Active', lastRun: new Date(Date.now() - 7200000).toISOString(), dnaExtracted: 189, errors: 2 },
    { recordId: 'DES-003', site: 'awwwards.com', era: '2015-2020', status: 'Paused', lastRun: new Date(Date.now() - 10800000).toISOString(), dnaExtracted: 156, errors: 1 },
    { recordId: 'DES-004', site: 'cssawards.com', era: '2014 Foundation', status: 'Active', lastRun: new Date(Date.now() - 1800000).toISOString(), dnaExtracted: 98, errors: 0 }
  ]);

  const [uiAdaptationData, setUiAdaptationData] = useState([
    { adaptationId: 'UI-001', component: 'Navigation', changeType: 'Theme Swap', palette: '#4285F4,#DB4437,#F4B400', paletteApplied: 'Yes', currentFunction: 'Navigation', accuracy: 98.7, timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Completed', validation: 'Passed' },
    { adaptationId: 'UI-002', component: 'Login Screen', changeType: 'Responsive Reflow', palette: '#1A1A1A,#FFFFFF,#FF6F61', paletteApplied: 'Yes', currentFunction: 'Authentication', accuracy: 95.2, timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'In Progress', validation: 'Pending' },
    { adaptationId: 'UI-003', component: 'Dashboard', changeType: 'Micro-Interaction', palette: '#0D0D0D,#EAEAEA,#FFB400', paletteApplied: 'No', currentFunction: 'Data Display', accuracy: 87.3, timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'Completed', validation: 'Failed' },
    { adaptationId: 'UI-004', component: 'Settings Panel', changeType: 'Dark Mode', palette: '#2C3E50,#ECF0F1,#3498DB', paletteApplied: 'Yes', currentFunction: 'Configuration', accuracy: 92.1, timestamp: new Date(Date.now() - 5400000).toISOString(), status: 'In Progress', validation: 'Pending' },
    { adaptationId: 'UI-005', component: 'Search Bar', changeType: 'Auto-complete', palette: '#34495E,#E74C3C,#F39C12', paletteApplied: 'No', currentFunction: 'Search', accuracy: 94.8, timestamp: new Date(Date.now() - 2700000).toISOString(), status: 'Completed', validation: 'Passed' },
    { adaptationId: 'UI-006', component: 'User Profile', changeType: 'Avatar System', palette: '#8E44AD,#2ECC71,#F1C40F', paletteApplied: 'Yes', currentFunction: 'User Management', accuracy: 96.5, timestamp: new Date(Date.now() - 4500000).toISOString(), status: 'Completed', validation: 'Passed' },
    { adaptationId: 'UI-007', component: 'Notification Center', changeType: 'Toast Messages', palette: '#E67E22,#16A085,#27AE60', paletteApplied: 'Yes', currentFunction: 'Alerts', accuracy: 91.4, timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'In Progress', validation: 'Pending' }
  ]);

  const [swarmAgentsData, setSwarmAgentsData] = useState([
    { agentId: 'AGT-001', adaptationId: 'ADAPT-001', role: 'Sifting Agent', function: 'Discovery & Sifting', fitForDuty: true, accuracy: 96.71, tasksCompleted: 1247, errorRate: 3.29 },
    { agentId: 'AGT-002', adaptationId: 'ADAPT-002', role: 'Deciphering Agent', function: 'Deciphering Logic', fitForDuty: false, accuracy: 97.78, tasksCompleted: 892, errorRate: 2.22 },
    { agentId: 'AGT-003', adaptationId: 'ADAPT-003', role: 'Classification Agent', function: 'Classification & Archiving', fitForDuty: true, accuracy: 99.03, tasksCompleted: 1567, errorRate: 0.97 },
    { agentId: 'AGT-004', adaptationId: 'ADAPT-004', role: 'Archiving Agent', function: 'Archiving & Storage', fitForDuty: true, accuracy: 97.87, tasksCompleted: 743, errorRate: 2.13 },
    { agentId: 'AGT-005', adaptationId: 'ADAPT-005', role: 'Creation Agent', function: 'Creation & Export', fitForDuty: false, accuracy: 97.82, tasksCompleted: 456, errorRate: 2.18 },
    { agentId: 'AGT-006', adaptationId: 'ADAPT-006', role: 'Verification Agent', function: 'Verification & QA', fitForDuty: true, accuracy: 98.45, tasksCompleted: 892, errorRate: 1.55 },
    { agentId: 'AGT-007', adaptationId: 'ADAPT-007', role: 'UI Adaptation Agent', function: 'UI Adaptation', fitForDuty: true, accuracy: 96.92, tasksCompleted: 634, errorRate: 3.08 }
  ]);

  const [trainingProgressData, setTrainingProgressData] = useState([
    { agentId: 'AGT-001', adaptationId: 'ADAPT-001', trainingModule: 'Pattern Recognition & Data Mining', progress: 87, progressSessions: '87%', completed: 23, accuracyImprovement: '+2.3%', lastSession: new Date(Date.now() - 3600000).toISOString(), nextSession: new Date(Date.now() + 3600000).toISOString() },
    { agentId: 'AGT-002', adaptationId: 'ADAPT-002', trainingModule: 'Logic Mapping & Accessibility', progress: 65, progressSessions: '65%', completed: 18, accuracyImprovement: '+1.8%', lastSession: new Date(Date.now() - 7200000).toISOString(), nextSession: new Date(Date.now() + 7200000).toISOString() },
    { agentId: 'AGT-003', adaptationId: 'ADAPT-003', trainingModule: 'Era Classification & Academic Validation', progress: 92, progressSessions: '92%', completed: 31, accuracyImprovement: '+3.1%', lastSession: new Date(Date.now() - 1800000).toISOString(), nextSession: new Date(Date.now() + 1800000).toISOString() },
    { agentId: 'AGT-004', adaptationId: 'ADAPT-004', trainingModule: 'Database Archival & Vector Embedding', progress: 78, progressSessions: '78%', completed: 25, accuracyImprovement: '+1.5%', lastSession: new Date(Date.now() - 10800000).toISOString(), nextSession: new Date(Date.now() + 10800000).toISOString() },
    { agentId: 'AGT-005', adaptationId: 'ADAPT-005', trainingModule: 'Export Generation & Timeline Creation', progress: 45, progressSessions: '45%', completed: 12, accuracyImprovement: '+0.9%', lastSession: new Date(Date.now() - 14400000).toISOString(), nextSession: new Date(Date.now() + 14400000).toISOString() },
    { agentId: 'AGT-006', adaptationId: 'ADAPT-006', trainingModule: 'Performance Validation & QA', progress: 71, progressSessions: '71%', completed: 19, accuracyImprovement: '+2.7%', lastSession: new Date(Date.now() - 21600000).toISOString(), nextSession: new Date(Date.now() + 21600000).toISOString() },
    { agentId: 'AGT-007', adaptationId: 'ADAPT-007', trainingModule: 'Palette Application & Layout Adaptation', progress: 83, progressSessions: '83%', completed: 27, accuracyImprovement: '+1.9%', lastSession: new Date(Date.now() - 28800000).toISOString(), nextSession: new Date(Date.now() + 28800000).toISOString() }
  ]);

  const [hrDashboardData, setHrDashboardData] = useState([
    {
      agentId: 'AGT-001',
      adaptationId: 'ADAPT-001',
      department: 'Discovery',
      trainingModule: 'Pattern Recognition & Data Mining',
      progressSessions: '87%',
      completed: 23,
      accuracyImprovement: '+2.3%',
      validation: 'Passed',
      sdtTimestamp: '3/11/2026 15:40:30',
      artifact: 'dependencies.json',
      traceLink: 'trace/AGT-001-PRDM.log',
      skillsInjected: 'GSAP plugin mapping; dependency graphing',
      auditorJudgment: 'Pass',
      hrApproval: 'Approved',
      fitForDuty: true,
      auditTrailId: 'AUD-001',
      auditTimestamp: '3/11/2026 16:00:00',
      auditNotes: 'HR confirmed Fit-for-Duty'
    },
    {
      agentId: 'AGT-002',
      adaptationId: 'ADAPT-002',
      department: 'Deciphering',
      trainingModule: 'Logic Mapping & Accessibility',
      progressSessions: '65%',
      completed: 18,
      accuracyImprovement: '+1.8%',
      validation: 'Failed',
      sdtTimestamp: '3/11/2026 14:40:30',
      artifact: 'gsap-cmd-state.log',
      traceLink: 'trace/AGT-002-LMA.log',
      skillsInjected: 'Easing curves; accessibility validation',
      auditorJudgment: 'Fail',
      hrApproval: 'Rejected',
      fitForDuty: false,
      auditTrailId: 'AUD-002',
      auditTimestamp: '3/11/2026 16:10:00',
      auditNotes: 'HR rejected due to accessibility failure'
    },
    {
      agentId: 'AGT-003',
      adaptationId: 'ADAPT-003',
      department: 'Classification',
      trainingModule: 'Era Classification & Academic Validation',
      progressSessions: '92%',
      completed: 31,
      accuracyImprovement: '+3.1%',
      validation: 'Passed',
      sdtTimestamp: '3/11/2026 16:10:30',
      artifact: 'compat-audit.json',
      traceLink: 'trace/AGT-003-ECA.log',
      skillsInjected: 'Era taxonomy; academic compliance',
      auditorJudgment: 'Pass',
      hrApproval: 'Approved',
      fitForDuty: true,
      auditTrailId: 'AUD-003',
      auditTimestamp: '3/11/2026 16:30:00',
      auditNotes: 'HR confirmed Fit-for-Duty'
    },
    {
      agentId: 'AGT-004',
      adaptationId: 'ADAPT-004',
      department: 'Archiving',
      trainingModule: 'Database Archival & Vector Embedding',
      progressSessions: '78%',
      completed: 25,
      accuracyImprovement: '+1.5%',
      validation: 'Passed',
      sdtTimestamp: '3/11/2026 13:40:30',
      artifact: 'a11y-compliance-check.json',
      traceLink: 'trace/AGT-004-DAVE.log',
      skillsInjected: 'Database archival; vector embedding',
      auditorJudgment: 'Pass',
      hrApproval: 'Approved',
      fitForDuty: true,
      auditTrailId: 'AUD-004',
      auditTimestamp: '3/11/2026 16:45:00',
      auditNotes: 'HR confirmed Fit-for-Duty'
    },
    {
      agentId: 'AGT-005',
      adaptationId: 'ADAPT-005',
      department: 'Creation',
      trainingModule: 'Export Generation & Timeline Creation',
      progressSessions: '45%',
      completed: 12,
      accuracyImprovement: '+0.9%',
      validation: 'Pending',
      sdtTimestamp: '3/11/2026 12:40:30',
      artifact: 'timeline-hierarchy.log',
      traceLink: 'trace/AGT-005-EGTC.log',
      skillsInjected: 'Timeline choreography; WebGL sync',
      auditorJudgment: 'Pending',
      hrApproval: 'Awaiting Review',
      fitForDuty: false,
      auditTrailId: 'AUD-005',
      auditTimestamp: '3/11/2026 17:00:00',
      auditNotes: 'Awaiting HR approval'
    }
  ]);

  // Backend API Service
  const ApiService = {
    async fetchScrapeData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate real-time data updates
          const updatedData = scrapeData.map(item => ({
            ...item,
            lastRun: new Date(Date.now() - Math.random() * 7200000).toISOString(),
            dnaExtracted: item.dnaExtracted + Math.floor(Math.random() * 5),
            errors: Math.random() > 0.8 ? item.errors + 1 : item.errors
          }));
          resolve(updatedData);
        }, 500);
      });
    },

    async fetchUiAdaptationData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedData = uiAdaptationData.map(item => ({
            ...item,
            timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
            status: Math.random() > 0.7 ? 'Completed' : item.status === 'Completed' ? 'Completed' : 'In Progress'
          }));
          resolve(updatedData);
        }, 500);
      });
    },

    async fetchSwarmAgentsData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedData = swarmAgentsData.map(agent => ({
            ...agent,
            tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 3),
            accuracy: Math.min(100, agent.accuracy + (Math.random() - 0.5) * 0.5),
            errorRate: Math.max(0, agent.errorRate + (Math.random() - 0.5) * 0.2)
          }));
          resolve(updatedData);
        }, 500);
      });
    },

    async fetchTrainingProgressData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedData = trainingProgressData.map(item => ({
            ...item,
            progress: Math.min(100, item.progress + Math.random() * 2),
            sessionsCompleted: item.sessionsCompleted + (Math.random() > 0.7 ? 1 : 0),
            lastSession: new Date(Date.now() - Math.random() * 3600000).toISOString()
          }));
          resolve(updatedData);
        }, 500);
      });
    },

    async fetchHrDashboardData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedData = hrDashboardData.map(agent => ({
            ...agent,
            auditTimestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
            auditorJudgment: Math.random() > 0.8 ? 'Pass' : agent.auditorJudgment
          }));
          resolve(updatedData);
        }, 500);
      });
    }
  };

  // Manual refresh function
  const manualRefresh = async () => {
    try {
      const [scrape, uiAdaptation, swarmAgents, trainingProgress, hrDashboard] = await Promise.all([
        ApiService.fetchScrapeData(),
        ApiService.fetchUiAdaptationData(),
        ApiService.fetchSwarmAgentsData(),
        ApiService.fetchTrainingProgressData(),
        ApiService.fetchHrDashboardData()
      ]);

      setScrapeData(scrape);
      setUiAdaptationData(uiAdaptation);
      setSwarmAgentsData(swarmAgents);
      setTrainingProgressData(trainingProgress);
      setHrDashboardData(hrDashboard);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(manualRefresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // WebSocket simulation (for real-time updates)
  useEffect(() => {
    // Only try to connect WebSocket if it's available, otherwise use polling
    try {
      const ws = new WebSocket('ws://localhost:8080/realtime');
      
      ws.onopen = () => {
        console.log('WebSocket connected for real-time updates');
        setSystemStatus(prev => ({
          ...prev,
          websocket: { ...prev.websocket, status: 'on', reason: 'WebSocket connected', color: '#4caf50' }
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle real-time updates based on message type
        switch(data.type) {
          case 'scrape_update':
            setScrapeData(prev => prev.map(item => 
              item.recordId === data.recordId ? { ...item, ...data.updates } : item
            ));
            break;
          case 'agent_update':
            setSwarmAgentsData(prev => prev.map(agent => 
              agent.agentId === data.agentId ? { ...agent, ...data.updates } : agent
            ));
            break;
          // Add more cases as needed
        }
        setLastUpdate(new Date());
      };

      ws.onerror = () => {
        console.log('WebSocket connection failed, falling back to polling');
        setSystemStatus(prev => ({
          ...prev,
          websocket: { ...prev.websocket, status: 'on', reason: 'Polling active (WebSocket unavailable)', color: '#4caf50' }
        }));
      };

      ws.onclose = () => {
        console.log('WebSocket closed, using polling');
        setSystemStatus(prev => ({
          ...prev,
          websocket: { ...prev.websocket, status: 'on', reason: 'Polling active (WebSocket unavailable)', color: '#4caf50' }
        }));
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.log('WebSocket not available, using polling only');
      setSystemStatus(prev => ({
        ...prev,
        websocket: { ...prev.websocket, status: 'on', reason: 'Polling active (WebSocket unavailable)', color: '#4caf50' }
      }));
    }
  }, []);

  const toggleSystemStatus = (system) => {
    setSystemStatus(prev => ({
      ...prev,
      [system]: {
        ...prev[system],
        status: prev[system].status === 'on' ? 'off' : 'on',
        color: prev[system].status === 'on' ? '#f44336' : '#4caf50',
        reason: prev[system].status === 'on' ? 
          `System ${system} manually disabled for maintenance` : 
          `System ${system} reactivated and operational`
      }
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleHumanIntervention = (agent) => {
    setSelectedAgent(agent);
    setInterventionActions([
      'Review agent performance metrics',
      'Analyze training completion rates',
      'Check skill injection accuracy',
      'Validate audit trail compliance',
      'Assess KPI achievement status'
    ]);
    setShowInterventionModal(true);
  };

  const runAgentTest = (agent) => {
    // Simulate running a comprehensive test for the agent
    const testType = agent.department === 'Creation' ? 'Color Pattern Creation' : 
                    agent.department === 'Discovery' ? 'Code Rendering Test' : 
                    agent.department === 'Classification' ? 'Page Layout Analysis' : 
                    'Performance Validation Test';
    
    const mockTestResults = {
      testType: testType,
      agentId: agent.agentId,
      timestamp: new Date().toISOString(),
      kpiMetrics: {
        accuracy: Math.floor(Math.random() * 20) + 80, // 80-99%
        speed: Math.floor(Math.random() * 30) + 70, // 70-99%
        compliance: Math.floor(Math.random() * 15) + 85, // 85-99%
        efficiency: Math.floor(Math.random() * 25) + 75 // 75-99%
      },
      visualResults: {
        colorAccuracy: agent.department === 'Creation' ? Math.floor(Math.random() * 10) + 90 : null,
        codeQuality: agent.department === 'Discovery' ? Math.floor(Math.random() * 15) + 85 : null,
        layoutConsistency: agent.department === 'Classification' ? Math.floor(Math.random() * 12) + 88 : null
      },
      status: 'Completed',
      recommendations: [
        'Performance meets KPI standards',
        'Skills injection successful',
        'Ready for production deployment'
      ]
    };
    
    setTestResults(mockTestResults);
    setShowTestModal(true);
  };

  const handleViewTrace = (agent) => {
    const mockTraceData = {
      agentId: agent.agentId,
      traceLink: agent.traceLink,
      timestamp: new Date().toISOString(),
      traceDetails: {
        executionPath: [
          `Step 1: Initialize ${agent.trainingModule} module`,
          `Step 2: Load training dataset from ${agent.artifact}`,
          `Step 3: Process skills injection: ${agent.skillsInjected}`,
          `Step 4: Validate auditor judgment: ${agent.auditorJudgment}`,
          `Step 5: HR approval check: ${agent.hrApproval}`,
          `Step 6: Final fit-for-duty assessment: ${agent.fitForDuty ? 'PASS' : 'FAIL'}`
        ],
        performanceMetrics: {
          executionTime: `${Math.floor(Math.random() * 500) + 100}ms`,
          memoryUsage: `${Math.floor(Math.random() * 50) + 20}MB`,
          cpuUtilization: `${Math.floor(Math.random() * 30) + 10}%`,
          networkCalls: Math.floor(Math.random() * 10) + 5
        },
        errorLog: agent.auditorJudgment === 'Fail' ? [
          `ERROR: Validation failed at step 3`,
          `ERROR: Skills injection incomplete`,
          `ERROR: Auditor judgment: ${agent.auditorJudgment}`
        ] : [],
        successIndicators: agent.auditorJudgment === 'Pass' ? [
          `SUCCESS: All validation checks passed`,
          `SUCCESS: Skills injection completed successfully`,
          `SUCCESS: HR approval granted`
        ] : []
      }
    };
    
    setSelectedTrace(mockTraceData);
    setShowTraceModal(true);
  };

  const handleViewAudit = (agent) => {
    const mockAuditData = {
      agentId: agent.agentId,
      auditTrailId: agent.auditTrailId,
      auditTimestamp: agent.auditTimestamp,
      auditDetails: {
        complianceChecks: {
          dataPrivacy: Math.random() > 0.3 ? 'PASS' : 'FAIL',
          securityProtocols: Math.random() > 0.2 ? 'PASS' : 'FAIL',
          performanceStandards: Math.random() > 0.4 ? 'PASS' : 'FAIL',
          documentationComplete: Math.random() > 0.1 ? 'PASS' : 'FAIL'
        },
        skillValidation: {
          technicalSkills: Math.floor(Math.random() * 20) + 80,
          softSkills: Math.floor(Math.random() * 15) + 85,
          domainKnowledge: Math.floor(Math.random() * 25) + 75,
          problemSolving: Math.floor(Math.random() * 30) + 70
        },
        riskAssessment: {
          operationalRisk: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW',
          complianceRisk: Math.random() > 0.8 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
          performanceRisk: Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.2 ? 'MEDIUM' : 'LOW'
        },
        recommendations: [
          agent.auditorJudgment === 'Pass' ? 
            'Agent meets all requirements for deployment' : 
            'Agent requires additional training before deployment',
          'Regular performance monitoring recommended',
          'Quarterly skills reassessment advised'
        ],
        nextReviewDate: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toLocaleDateString()
      }
    };
    
    setSelectedAudit(mockAuditData);
    setShowAuditModal(true);
  };

  const handleTimelineReplay = (agent) => {
    const mockReplayData = {
      agentId: agent.agentId,
      department: agent.department,
      replayTimeline: [
        {
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action: 'Training Module Initialization',
          details: `Started ${agent.trainingModule} training`,
          status: 'SUCCESS',
          duration: '45ms'
        },
        {
          timestamp: new Date(Date.now() - 6000000).toISOString(),
          action: 'Dataset Loading',
          details: `Loaded ${agent.artifact} for processing`,
          status: 'SUCCESS',
          duration: '120ms'
        },
        {
          timestamp: new Date(Date.now() - 4800000).toISOString(),
          action: 'Skills Injection',
          details: `Processed skills injection: ${agent.skillsInjected}`,
          status: 'SUCCESS',
          duration: '89ms'
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'Auditor Validation',
          details: `Auditor judgment: ${agent.auditorJudgment}`,
          status: agent.auditorJudgment === 'Pass' ? 'SUCCESS' : 'WARNING',
          duration: '67ms'
        },
        {
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          action: 'HR Approval',
          details: `HR approval status: ${agent.hrApproval}`,
          status: agent.hrApproval === 'Approved' ? 'SUCCESS' : 'PENDING',
          duration: '34ms'
        },
        {
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          action: 'Fit-for-Duty Assessment',
          details: `Final assessment: ${agent.fitForDuty ? 'PASS' : 'FAIL'}`,
          status: agent.fitForDuty ? 'SUCCESS' : 'ERROR',
          duration: '23ms'
        }
      ],
      totalDuration: '378ms',
      successRate: agent.auditorJudgment === 'Pass' ? '100%' : '83%',
      errorCount: agent.auditorJudgment === 'Pass' ? 0 : 1
    };
    
    setSelectedReplay(mockReplayData);
    setReplayProgress(0);
    setShowReplayModal(true);
  };

  const handleMultiAgentReplay = () => {
    const mockMultiAgentData = {
      timestamp: new Date().toISOString(),
      agents: hrDashboardData.slice(0, 3).map(agent => ({
        agentId: agent.agentId,
        department: agent.department,
        status: agent.auditorJudgment === 'Pass' ? 'ACTIVE' : 'WARNING',
        progress: Math.floor(Math.random() * 40) + 60,
        currentAction: agent.auditorJudgment === 'Pass' ? 'Processing tasks' : 'Requires review',
        metrics: {
          tasksCompleted: Math.floor(Math.random() * 100) + 50,
          accuracy: Math.floor(Math.random() * 15) + 85,
          responseTime: Math.floor(Math.random() * 200) + 100
        }
      })),
      comparativeMetrics: {
        averageAccuracy: 92.3,
        totalTasksCompleted: 1247,
        systemEfficiency: 87.5,
        complianceRate: 95.2
      },
      timeline: [
        { time: 'T-30min', event: 'System initialization', status: 'SUCCESS' },
        { time: 'T-20min', event: 'Agent deployment sequence', status: 'SUCCESS' },
        { time: 'T-10min', event: 'Load balancing configuration', status: 'SUCCESS' },
        { time: 'T-5min', event: 'Performance optimization', status: 'SUCCESS' },
        { time: 'T-0min', event: 'Full operational status', status: 'ACTIVE' }
      ]
    };
    
    setMultiAgentData(mockMultiAgentData);
    setShowMultiAgentReplayModal(true);
  };

  const playReplay = () => {
    setReplayPlaying(true);
    const interval = setInterval(() => {
      setReplayProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setReplayPlaying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const pauseReplay = () => {
    setReplayPlaying(false);
  };

  // HR Chat Bot Knowledge Base
  const hrKnowledgeBase = {
    departments: {
      'Creation': 'Handles color pattern creation, visual design, and export generation. Agents focus on aesthetic and creative tasks.',
      'Discovery': 'Manages data sifting, code rendering, and logic analysis. Agents process raw data and extract insights.',
      'Classification': 'Performs era classification, academic validation, and archival tasks. Agents ensure data categorization and compliance.',
      'Verification': 'Conducts quality assurance, performance validation, and testing. Agents maintain system integrity.',
      'Archiving': 'Handles data storage, vector embedding, and retrieval systems. Agents manage data lifecycle.',
      'UI Adaptation': 'Manages interface customization, palette application, and user experience optimization.'
    },
    agentStatus: {
      'HR confirmed Fit-for-Duty': 'Agent has passed all HR validations and is approved for production deployment.',
      'Pending HR Review': 'Agent is awaiting HR approval and may require additional documentation.',
      'Requires Additional Training': 'Agent needs further skill development before deployment consideration.',
      'Under Investigation': 'Agent performance or compliance issues require detailed review.'
    },
    compliance: {
      'ISO 27001': 'Information security management standard for HR data protection.',
      'GDPR': 'General Data Protection Regulation for employee data privacy.',
      'WCAG 2.1': 'Web Content Accessibility Guidelines for inclusive design.',
      'Labor Laws': 'Employment regulations and worker protection standards.'
    },
    procedures: {
      'Skill Injection': 'Process of adding new capabilities to agents through structured training modules.',
      'Auditor Judgment': 'Formal evaluation of agent performance against established criteria.',
      'HR Approval': 'Final authorization step for agent deployment readiness.',
      'Fit-for-Duty Assessment': 'Comprehensive evaluation of agent operational readiness.'
    }
  };

  // Initialize voice recognition and time-based greeting
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
    
    // Add initial greeting message when chat bot opens
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    
    const initialMessage = {
      id: Date.now(),
      sender: 'bot',
      type: 'greeting',
      message: `${greeting} ${user?.username || 'User'}`,
      proof: `HR Bot System v2.0 - Active since ${new Date().toLocaleDateString()}`,
      actions: ['Start voice conversation', 'Ask about departments', 'View capabilities'],
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([initialMessage]);
  }, [showHRChatBot, user?.username]);

  // Save chat to history when messages exist
  useEffect(() => {
    if (chatMessages.length > 1) { // More than just greeting
      const newHistory = [...chatHistory];
      const chatSession = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        messageCount: chatMessages.length,
        lastMessage: chatMessages[chatMessages.length - 1]?.message || '',
        hasProof: chatMessages.some(msg => msg.sender === 'bot' && msg.actions)
      };
      
      // Add to history and keep only last 5
      newHistory.unshift(chatSession);
      if (newHistory.length > 5) {
        newHistory.pop();
      }
      setChatHistory(newHistory);
    }
  }, [chatMessages]);

  const generateHRResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for department inquiries
    if (lowerMessage.includes('department') || lowerMessage.includes('creation') || lowerMessage.includes('discovery')) {
      const dept = Object.keys(hrKnowledgeBase.departments).find(key => 
        lowerMessage.includes(key.toLowerCase())
      );
      if (dept) {
        return {
          sender: 'bot',
          type: 'department_info',
          message: hrKnowledgeBase.departments[dept],
          proof: `Department data verified from HR database. Last updated: ${new Date().toLocaleDateString()}`,
          actions: ['View department agents', 'Check department compliance', 'Analyze department performance'],
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Check for agent status inquiries
    if (lowerMessage.includes('agent') || lowerMessage.includes('status') || lowerMessage.includes('fit for duty')) {
      const status = Object.keys(hrKnowledgeBase.agentStatus).find(key => 
        lowerMessage.includes(key.toLowerCase())
      );
      if (status) {
        return {
          sender: 'bot',
          type: 'agent_status',
          message: hrKnowledgeBase.agentStatus[status],
          proof: `Status verified from audit trail. Reference: HR-AUDIT-${Date.now()}`,
          actions: ['View detailed audit', 'Generate status report', 'Schedule review meeting'],
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Check for compliance inquiries
    if (lowerMessage.includes('compliance') || lowerMessage.includes('iso') || lowerMessage.includes('gdpr')) {
      const compliance = Object.keys(hrKnowledgeBase.compliance).find(key => 
        lowerMessage.includes(key.toLowerCase())
      );
      if (compliance) {
        return {
          sender: 'bot',
          type: 'compliance_info',
          message: hrKnowledgeBase.compliance[compliance],
          proof: `Compliance verified against regulatory database. Certificate: COMPL-${Date.now()}`,
          actions: ['Generate compliance report', 'Schedule compliance audit', 'Update compliance documentation'],
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Check for procedure inquiries
    if (lowerMessage.includes('procedure') || lowerMessage.includes('skill injection') || lowerMessage.includes('auditor')) {
      const procedure = Object.keys(hrKnowledgeBase.procedures).find(key => 
        lowerMessage.includes(key.toLowerCase())
      );
      if (procedure) {
        return {
          sender: 'bot',
          type: 'procedure_info',
          message: hrKnowledgeBase.procedures[procedure],
          proof: `Procedure documented in HR manual. Section: HR-PROC-${Date.now()}`,
          actions: ['View procedure details', 'Download procedure guide', 'Schedule training session'],
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Handle voice feedback and general conversation
    if (lowerMessage.includes('feedback') || lowerMessage.includes('scraping') || lowerMessage.includes('voice')) {
      return {
        sender: 'bot',
        type: 'feedback',
        message: 'Thank you for your feedback. I understand you want me to respond via voice. I\'m ready to assist with any HR questions or tasks you have.',
        proof: `Voice feedback received - ${new Date().toLocaleString()}`,
        actions: ['Continue voice conversation', 'Ask HR question', 'Generate voice report'],
        timestamp: new Date().toISOString()
      };
    }
    
    // Default response for general inquiries
    return {
      sender: 'bot',
      type: 'general_info',
      message: 'I\'m here to help with HR questions. What would you like to know about departments, agents, compliance, or procedures?',
      proof: `HR Bot System v2.0 - Active since ${new Date().toLocaleDateString()}`,
      actions: ['Ask about departments', 'Check agent status', 'Review compliance'],
      timestamp: new Date().toISOString()
    };
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: currentMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Generate HR Bot response
    setTimeout(() => {
      const botResponse = generateHRResponse(currentMessage);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        ...botResponse,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
    
    setCurrentMessage('');
  };

  const handleVoiceInput = () => {
    if (!voiceSupported) {
      alert('Voice recognition is not supported in your browser. Please use text input.');
      return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const generateProofPopup = (message) => {
    const popupContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h3 style="color: #1976d2; margin-bottom: 15px;">HR Bot Proof Verification</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
          <strong>Message:</strong> ${message.message}<br><br>
          <strong>Type:</strong> ${message.type}<br><br>
          <strong>Proof:</strong> ${message.proof}<br><br>
          <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br><br>
          <strong>Verification ID:</strong> HR-BOT-${Date.now()}
        </div>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
          <strong>Recommended Actions:</strong><br>
          ${message.actions.map(action => `• ${action}`).join('<br>')}
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="background: #1976d2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Print Proof
          </button>
        </div>
      </div>
    `;
    
    const popupWindow = window.open('', '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
    popupWindow.document.write(popupContent);
    popupWindow.document.close();
  };

  const tabs = [
    { id: 'design-intelligence', label: 'Design Intelligence', icon: '' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5' }}>
      {/* Left Sidebar */}
      <div style={{
        width: sidebarExpanded ? '280px' : '60px',
        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        color: darkMode ? '#ffffff' : '#333333',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}`
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${darkMode ? '#404040' : '#e0e0e0' }` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarExpanded && <h3 style={{ margin: 0, fontSize: '18px', color: '#1976d2' }}>CodeVoyager</h3>}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: darkMode ? '#ffffff' : '#666666',
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
                backgroundColor: activeTab === tab.id ? '#1976d2' : 'transparent',
                color: activeTab === tab.id ? 'white' : (darkMode ? '#ffffff' : '#333333'),
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
              {sidebarExpanded && <span>{tab.label}</span>}
            </button>
          ))}
        </div>

        {/* System Status Monitor */}
        {sidebarExpanded && (
          <div style={{ padding: '20px', borderTop: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}` }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>System Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name={`status-${key}`}
                    checked={status.status === 'on'}
                    onChange={() => toggleSystemStatus(key)}
                    style={{ 
                      width: '12px', 
                      height: '12px',
                      accentColor: status.color
                    }}
                  />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: status.color
                  }}></div>
                  <div style={{ fontSize: '12px', flex: 1, color: darkMode ? '#ffffff' : '#333333' }}>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{key}</div>
                    <div style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '10px' }}>{status.details}</div>
                    <div style={{ 
                      color: status.status === 'on' ? '#4caf50' : '#f44336', 
                      fontSize: '9px',
                      fontStyle: 'italic'
                    }}>
                      {status.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div style={{ padding: '20px', borderTop: `1px solid ${darkMode ? '#404040' : '#e0e0e0'}` }}>
          {sidebarExpanded && (
            <div>
              <div style={{ fontSize: '14px', marginBottom: '5px', color: darkMode ? '#ffffff' : '#333333', fontWeight: '600' }}>{user.username}</div>
              <div style={{ fontSize: '14px', color: darkMode ? '#cccccc' : '#666666' }}>{user.role}</div>
            </div>
          )}
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: sidebarExpanded ? '10px' : '0'
            }}
          >
            {sidebarExpanded ? 'Logout' : '⬆'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: darkMode ? '#1a1a1a' : 'white' }}>
        {/* Header */}
        <div style={{ 
          padding: '20px 30px', 
          borderBottom: `1px solid ${darkMode ? '#404040' : '#ddd'}`,
          backgroundColor: darkMode ? '#2d2d2d' : 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#1976d2', fontSize: '18px', fontWeight: '600' }}>
            {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '8px 12px',
                backgroundColor: darkMode ? '#555555' : '#e0e0e0',
                color: darkMode ? '#ffffff' : '#333333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {darkMode ? '🌙' : '☀️'} {darkMode ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={manualRefresh}
              style={{
                padding: '8px 12px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🔄 Refresh
            </button>
            <button
              onClick={toggleAutoRefresh}
              style={{
                padding: '8px 12px',
                backgroundColor: autoRefresh ? '#4caf50' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {autoRefresh ? '⏸️ Auto' : '▶️ Auto'}
            </button>
            <span style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '12px' }}>
              Last: {lastUpdate.toLocaleTimeString()}
            </span>
            <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>Welcome, {user.username}</span>
            <span style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>({user.role})</span>
            <button
              onClick={() => setShowHRChatBot(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(76, 175, 80, 0.2)'
              }}
            >
              🤖 HR Chat Bot
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '30px' }}>
          {activeTab === 'design-intelligence' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: `1px solid ${darkMode ? '#404040' : '#ddd'}`, paddingBottom: '10px', justifyContent: 'center' }}>
                {['scraping', 'ui-adaptation', 'swarm-agents', 'training-progress', 'hr'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDesignIntelligenceSubTab(tab)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px 4px 0 0',
                      backgroundColor: designIntelligenceSubTab === tab ? '#1976d2' : (darkMode ? '#404040' : '#f5f5f5'),
                      color: designIntelligenceSubTab === tab ? 'white' : (darkMode ? '#ffffff' : '#333333'),
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: designIntelligenceSubTab === tab ? 'bold' : 'normal'
                    }}
                  >
                    {tab === 'scraping' ? 'Scrape Status' : tab === 'ui-adaptation' ? 'UI Adaptation' : tab === 'swarm-agents' ? 'Swarm Agents' : tab === 'training-progress' ? 'Training Progress' : 'HR'}
                  </button>
                ))}
              </div>

            {designIntelligenceSubTab === 'scraping' && (
              <div>
                <h3 style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>Design Intelligence Scraper - DNA Extraction Pipeline</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                    margin: '0 auto',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>RecordID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Target Site</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Temporal Era</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Status</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Last Run</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>DNA Extracted</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Error Count</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa'
                        }}>Admin Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapeData.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{item.recordId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{item.site}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{item.era}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: item.status === 'Active' ? (darkMode ? '#2e7d32' : '#e8f5e8') : (darkMode ? '#f57c00' : '#fff3e0'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            {new Date(item.lastRun).toLocaleString()}
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{item.dnaExtracted}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ color: item.errors > 0 ? '#c62828' : '#2e7d32', fontSize: '14px' }}>
                              {item.errors}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <button
                              onClick={() => alert(`Admin intervention for ${item.recordId}: View logs, restart scraper, or adjust parameters`)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Intervene
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {designIntelligenceSubTab === 'ui-adaptation' && (
              <div>
                <h3 style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>UI Adaptation Log - Database-Driven Re-skinning</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                    margin: '0 auto',
                    fontSize: '14px',
                    tableLayout: 'fixed'
                  }}>
                    <thead>
                      <tr style={{ height: '50px' }}>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>AdaptationID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Component</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Change Type</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Palette Applied</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Current Function</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '80px'
                        }}>Accuracy (%)</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Status</th>
                                                <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Palette Applied</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Timestamp</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Status</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Admin Control</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uiAdaptationData.map((item, idx) => (
                        <tr key={idx} style={{ height: '60px' }}>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.adaptationId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.component}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.changeType}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.paletteApplied}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{new Date(item.timestamp).toLocaleString()}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: item.status === 'Applied' ? (darkMode ? '#2e7d32' : '#e8f5e8') : (darkMode ? '#f57c00' : '#fff3e0'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <button
                              onClick={() => alert(`Admin control for ${item.adaptationId}: View changes, rollback, or adjust parameters`)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Control
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {designIntelligenceSubTab === 'swarm-agents' && (
              <div>
                <h3 style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>Swarm Agent Assignment Log - Pipeline Flow Agents</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                    margin: '0 auto',
                    fontSize: '14px',
                    tableLayout: 'fixed'
                  }}>
                    <thead>
                      <tr style={{ height: '50px' }}>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>AgentID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>AdaptationID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Role</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '200px'
                        }}>Current Function</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Fit for Duty</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Accuracy</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Tasks Completed</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Error Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swarmAgentsData.map((agent, idx) => (
                        <tr key={idx} style={{ height: '60px' }}>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.agentId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.adaptationId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.role}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.function}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: agent.fitForDuty ? (darkMode ? '#2e7d32' : '#e8f5e8') : (darkMode ? '#c62828' : '#ffebee'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {agent.fitForDuty ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ color: agent.accuracy > 95 ? '#4caf50' : agent.accuracy > 85 ? '#ff9800' : '#f44336', fontSize: '14px' }}>
                              {agent.accuracy.toFixed(1)}%
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{agent.tasksCompleted}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ color: agent.errorRate < 2 ? '#4caf50' : agent.errorRate < 5 ? '#ff9800' : '#f44336', fontSize: '14px' }}>
                              {agent.errorRate.toFixed(1)}%
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <button
                              onClick={() => alert(`Admin control for ${agent.agentId}: Reassign role, pause agent, or adjust parameters`)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Control
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {designIntelligenceSubTab === 'training-progress' && (
              <div>
                <h3 style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>Agent Training Progress - Continuous Learning Pipeline</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                    margin: '0 auto',
                    fontSize: '14px',
                    tableLayout: 'fixed'
                  }}>
                    <thead>
                      <tr style={{ height: '50px' }}>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>AgentID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>AdaptationID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '200px'
                        }}>Training Module</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Progress Sessions</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Completed</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Accuracy Improvement</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Last Session</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Next Session</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Audit Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingProgressData.map((item, idx) => (
                        <tr key={idx} style={{ height: '60px' }}>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.agentId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{item.trainingModule}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            {item.progressSessions}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>{item.completed}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ color: '#4caf50', fontSize: '14px' }}>+{item.accuracyImprovement}%</span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{new Date(item.lastSession).toLocaleString()}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{new Date(item.nextSession).toLocaleString()}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <button
                              onClick={() => alert(`Audit report for ${item.agentId}: View detailed training metrics and performance analysis`)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Audit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {designIntelligenceSubTab === 'hr' && (
              <div>
                <h3 style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>HR Dashboard for Design Intelligence</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, margin: '0 auto' }}>
                    <thead>
                      <tr style={{ backgroundColor: darkMode ? '#404040' : '#f3e5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>AgentID</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Training Module</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Progress</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Sessions Completed</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Accuracy Improvement</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Last Session</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Next Session</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, fontSize: '14px', fontWeight: '600', color: darkMode ? '#ffffff' : '#333333' }}>Audit Report</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { agentId: 'AGT-001', module: 'Pattern Recognition & Data Mining', progress: 87, sessionsCompleted: 23, improvement: '+2.3%', lastSession: new Date(Date.now() - 3600000).toISOString(), nextSession: new Date(Date.now() + 3600000).toISOString() },
                        { agentId: 'AGT-002', module: 'Logic Mapping & Accessibility', progress: 65, sessionsCompleted: 18, improvement: '+1.8%', lastSession: new Date(Date.now() - 7200000).toISOString(), nextSession: new Date(Date.now() + 7200000).toISOString() },
                        { agentId: 'AGT-003', module: 'Era Classification & Academic Validation', progress: 92, sessionsCompleted: 31, improvement: '+3.1%', lastSession: new Date(Date.now() - 1800000).toISOString(), nextSession: new Date(Date.now() + 1800000).toISOString() },
                        { agentId: 'AGT-004', module: 'Database Archival & Vector Embedding', progress: 78, sessionsCompleted: 25, improvement: '+1.5%', lastSession: new Date(Date.now() - 10800000).toISOString(), nextSession: new Date(Date.now() + 10800000).toISOString() },
                        { agentId: 'AGT-005', module: 'Export Generation & Timeline Creation', progress: 45, sessionsCompleted: 12, improvement: '+0.9%', lastSession: new Date(Date.now() - 14400000).toISOString(), nextSession: new Date(Date.now() + 14400000).toISOString() },
                        { agentId: 'AGT-006', module: 'Performance Validation & QA', progress: 71, sessionsCompleted: 19, improvement: '+2.7%', lastSession: new Date(Date.now() - 21600000).toISOString(), nextSession: new Date(Date.now() + 21600000).toISOString() },
                        { agentId: 'AGT-007', module: 'Palette Application & Layout Adaptation', progress: 83, sessionsCompleted: 27, improvement: '+1.9%', lastSession: new Date(Date.now() - 28800000).toISOString(), nextSession: new Date(Date.now() + 28800000).toISOString() }
                      ].map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>{item.agentId}</td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>{item.module}</td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1, backgroundColor: darkMode ? '#555555' : '#e0e0e0', borderRadius: '4px', height: '8px' }}>
                                <div style={{ 
                                  width: `${item.progress}%`, 
                                  height: '100%', 
                                  backgroundColor: item.progress > 80 ? '#4caf50' : item.progress > 60 ? '#ff9800' : '#f44336',
                                  borderRadius: '4px'
                                }}></div>
                              </div>
                              <span style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>{item.progress}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>{item.sessionsCompleted}</td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                            <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>{item.improvement}</span>
                          </td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                            {new Date(item.lastSession).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                            {new Date(item.nextSession).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                            <button
                              onClick={() => alert(`Audit Report for ${item.agentId}: View detailed training history, error analysis, learning curves, and compliance reports`)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#7b1fa2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Audit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {designIntelligenceSubTab === 'hr' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: '0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px', fontWeight: '600' }}>HR Dashboard for Design Intelligence</h3>
                  <button
                    onClick={() => setShowHRChatBot(true)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                    }}
                  >
                    🤖 HR Head Chat Bot
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                    margin: '0 auto',
                    fontSize: '14px',
                    tableLayout: 'fixed'
                  }}>
                    <thead>
                      <tr style={{ height: '50px' }}>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>AgentID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Department</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '200px'
                        }}>Training Module</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>SDT Timestamp</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Artifact</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Trace Link</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '180px'
                        }}>Skills Injected</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Validation</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Auditor Judgment</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>HR Approval</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Fit for Duty</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Audit Trail ID</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Audit Timestamp</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Audit Notes</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '100px'
                        }}>Audit Actions</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '120px'
                        }}>Replay Actions</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          border: `1px solid ${darkMode ? '#555555' : '#ddd'}`, 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: darkMode ? '#ffffff' : '#333333',
                          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                          width: '150px'
                        }}>Human Intervention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {swarmAgentsData.map((agent, idx) => (
                        <tr key={idx} style={{ height: '60px' }}>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.agentId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.adaptationId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.trainingModule}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.progressSessions}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.completed}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            <span style={{ color: (agent.accuracyImprovement && agent.accuracyImprovement.startsWith('+')) ? '#4caf50' : '#f44336', fontSize: '14px' }}>
                              {agent.accuracyImprovement || '0%'}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: agent.validation === 'Passed' ? '#e8f5e8' : agent.validation === 'Pending' ? '#fff3cd' : '#f8d7da',
                              color: agent.validation === 'Passed' ? '#2e7d32' : agent.validation === 'Pending' ? '#856404' : '#721c24'
                            }}>
                              {agent.validation}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: agent.auditorJudgment === 'Pass' ? (darkMode ? '#2e7d32' : '#e8f5e8') : agent.auditorJudgment === 'Fail' ? (darkMode ? '#c62828' : '#ffebee') : (darkMode ? '#f57c00' : '#fff3e0'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {agent.auditorJudgment}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: agent.hrApproval === 'Approved' ? (darkMode ? '#2e7d32' : '#e8f5e8') : agent.hrApproval === 'Rejected' ? (darkMode ? '#c62828' : '#ffebee') : (darkMode ? '#f57c00' : '#fff3e0'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {agent.hrApproval}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: agent.fitForDuty ? (darkMode ? '#2e7d32' : '#e8f5e8') : (darkMode ? '#c62828' : '#ffebee'),
                              color: '#ffffff',
                              fontSize: '14px'
                            }}>
                              {agent.fitForDuty ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.auditTrailId}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.auditTimestamp}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>{agent.auditNotes}</td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <button
                              onClick={() => handleViewAudit(agent)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#795548',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Audit
                            </button>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button
                                onClick={() => handleTimelineReplay(agent)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#2196f3',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Timeline
                              </button>
                              <button
                                onClick={() => handleMultiAgentReplay()}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#9c27b0',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Multi-Agent
                              </button>
                            </div>
                          </td>
                          <td style={{ 
                            padding: '12px 16px', 
                            border: `1px solid ${darkMode ? '#404040' : '#ddd'}`, 
                            fontSize: '14px', 
                            color: darkMode ? '#ffffff' : '#333333',
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'
                          }}>
                            {agent.auditNotes === 'HR confirmed Fit-for-Duty' && (
                              <button
                                onClick={() => handleHumanIntervention(agent)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#ff6b35',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                Human Intervention
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Human Intervention Modal */}
      {showInterventionModal && selectedAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Human Intervention Required - {selectedAgent.agentId}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Agent Information:
              </h4>
              <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', lineHeight: '1.5' }}>
                <div><strong>Agent ID:</strong> {selectedAgent.agentId}</div>
                <div><strong>Department:</strong> {selectedAgent.department}</div>
                <div><strong>Training Module:</strong> {selectedAgent.trainingModule}</div>
                <div><strong>Status:</strong> HR confirmed Fit-for-Duty</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Required Actions:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                {interventionActions.map((action, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{action}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Human-in-the-Loop Testing:
              </h4>
              <p style={{ margin: '0 0 15px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                Run comprehensive test to validate agent performance and KPI achievement before final approval.
              </p>
              <button
                onClick={() => runAgentTest(selectedAgent)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Run Agent Test
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowInterventionModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Results Modal */}
      {showTestModal && testResults && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Agent Test Results - {testResults.agentId}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Test Type: {testResults.testType}
              </h4>
              <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                <div><strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}</div>
                <div><strong>Status:</strong> <span style={{ color: '#4caf50' }}>{testResults.status}</span></div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                KPI Performance Metrics:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                    {testResults.kpiMetrics.accuracy}%
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#cccccc' : '#666666' }}>Accuracy</div>
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                    {testResults.kpiMetrics.speed}%
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#cccccc' : '#666666' }}>Speed</div>
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
                    {testResults.kpiMetrics.compliance}%
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#cccccc' : '#666666' }}>Compliance</div>
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
                    {testResults.kpiMetrics.efficiency}%
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#cccccc' : '#666666' }}>Efficiency</div>
                </div>
              </div>
            </div>

            {testResults.visualResults && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                  Visual Performance Results:
                </h4>
                {testResults.visualResults.colorAccuracy && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                      Color Accuracy: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{testResults.visualResults.colorAccuracy}%</span>
                    </div>
                    <div style={{ 
                      height: '20px', 
                      backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                      borderRadius: '10px',
                      marginTop: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${testResults.visualResults.colorAccuracy}%`,
                        backgroundColor: '#4caf50',
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>
                )}
                {testResults.visualResults.codeQuality && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                      Code Quality: <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{testResults.visualResults.codeQuality}%</span>
                    </div>
                    <div style={{ 
                      height: '20px', 
                      backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                      borderRadius: '10px',
                      marginTop: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${testResults.visualResults.codeQuality}%`,
                        backgroundColor: '#2196f3',
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>
                )}
                {testResults.visualResults.layoutConsistency && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#333333' }}>
                      Layout Consistency: <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{testResults.visualResults.layoutConsistency}%</span>
                    </div>
                    <div style={{ 
                      height: '20px', 
                      backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                      borderRadius: '10px',
                      marginTop: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${testResults.visualResults.layoutConsistency}%`,
                        backgroundColor: '#ff9800',
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Recommendations:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                {testResults.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{rec}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => {
                  // Generate PDF report (simulation)
                  alert(`PDF Report Generated for ${testResults.agentId}\n\nTest Type: ${testResults.testType}\nKPI Metrics: Accuracy ${testResults.kpiMetrics.accuracy}%, Speed ${testResults.kpiMetrics.speed}%\n\nThis would generate a comprehensive PDF report with all test results and visual analysis.`);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Generate PDF Report
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setShowInterventionModal(false);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Approve Agent
              </button>
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setShowInterventionModal(false);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trace Modal */}
      {showTraceModal && selectedTrace && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Trace Log - {selectedTrace.agentId}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Trace Information:
              </h4>
              <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                <div><strong>Agent ID:</strong> {selectedTrace.agentId}</div>
                <div><strong>Trace Link:</strong> {selectedTrace.traceLink}</div>
                <div><strong>Timestamp:</strong> {new Date(selectedTrace.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Execution Path:
              </h4>
              <ol style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                {selectedTrace.traceDetails.executionPath.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{step}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Performance Metrics:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                <div><strong>Execution Time:</strong> {selectedTrace.traceDetails.performanceMetrics.executionTime}</div>
                <div><strong>Memory Usage:</strong> {selectedTrace.traceDetails.performanceMetrics.memoryUsage}</div>
                <div><strong>CPU Utilization:</strong> {selectedTrace.traceDetails.performanceMetrics.cpuUtilization}</div>
                <div><strong>Network Calls:</strong> {selectedTrace.traceDetails.performanceMetrics.networkCalls}</div>
              </div>
            </div>

            {selectedTrace.traceDetails.errorLog.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                  Error Log:
                </h4>
                <div style={{ color: '#f44336', fontSize: '14px' }}>
                  {selectedTrace.traceDetails.errorLog.map((error, idx) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>{error}</div>
                  ))}
                </div>
              </div>
            )}

            {selectedTrace.traceDetails.successIndicators.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                  Success Indicators:
                </h4>
                <div style={{ color: '#4caf50', fontSize: '14px' }}>
                  {selectedTrace.traceDetails.successIndicators.map((success, idx) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>{success}</div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowTraceModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {showAuditModal && selectedAudit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Audit Report - {selectedAudit.agentId}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Audit Information:
              </h4>
              <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                <div><strong>Agent ID:</strong> {selectedAudit.agentId}</div>
                <div><strong>Audit Trail ID:</strong> {selectedAudit.auditTrailId}</div>
                <div><strong>Audit Timestamp:</strong> {selectedAudit.auditTimestamp}</div>
                <div><strong>Next Review Date:</strong> {selectedAudit.auditDetails.nextReviewDate}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Compliance Checks:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(selectedAudit.auditDetails.complianceChecks).map(([key, value]) => (
                  <div key={key} style={{ 
                    padding: '8px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      backgroundColor: value === 'PASS' ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Skill Validation Scores:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(selectedAudit.auditDetails.skillValidation).map(([key, value]) => (
                  <div key={key} style={{ 
                    padding: '8px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px'
                  }}>
                    <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', marginBottom: '5px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div style={{ 
                      height: '8px', 
                      backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '5px'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${value}%`,
                        backgroundColor: value > 85 ? '#4caf50' : value > 70 ? '#ff9800' : '#f44336',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '12px', textAlign: 'right' }}>
                      {value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Risk Assessment:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {Object.entries(selectedAudit.auditDetails.riskAssessment).map(([key, value]) => (
                  <div key={key} style={{ 
                    padding: '8px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', marginBottom: '5px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: value === 'HIGH' ? '#f44336' : value === 'MEDIUM' ? '#ff9800' : '#4caf50',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Recommendations:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                {selectedAudit.auditDetails.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{rec}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  alert(`PDF Audit Report Generated for ${selectedAudit.agentId}\n\nAudit Trail ID: ${selectedAudit.auditTrailId}\nCompliance Status: ${Object.values(selectedAudit.auditDetails.complianceChecks).filter(v => v === 'PASS').length}/${Object.keys(selectedAudit.auditDetails.complianceChecks).length} checks passed\n\nThis would generate a comprehensive PDF audit report.`);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#795548',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Generate PDF Report
              </button>
              <button
                onClick={() => setShowAuditModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Replay Modal */}
      {showReplayModal && selectedReplay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Timeline Replay - {selectedReplay.agentId}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Replay Information:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>
                <div><strong>Agent ID:</strong> {selectedReplay.agentId}</div>
                <div><strong>Department:</strong> {selectedReplay.department}</div>
                <div><strong>Total Duration:</strong> {selectedReplay.totalDuration}</div>
                <div><strong>Success Rate:</strong> {selectedReplay.successRate}</div>
                <div><strong>Error Count:</strong> {selectedReplay.errorCount}</div>
                <div><strong>Status:</strong> {selectedReplay.errorCount === 0 ? 'SUCCESS' : 'WARNING'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Replay Controls:
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <button
                  onClick={replayPlaying ? pauseReplay : playReplay}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: replayPlaying ? '#ff9800' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {replayPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => { setReplayProgress(0); setReplayPlaying(false); }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#666666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Reset
                </button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px' }}>Progress:</span>
                  <div style={{ 
                    flex: 1, 
                    height: '8px', 
                    backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${replayProgress}%`,
                      backgroundColor: '#2196f3',
                      borderRadius: '4px',
                      transition: 'width 0.1s ease'
                    }} />
                  </div>
                  <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', minWidth: '40px' }}>
                    {replayProgress}%
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Execution Timeline:
              </h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {selectedReplay.replayTimeline.map((event, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${
                      event.status === 'SUCCESS' ? '#4caf50' : 
                      event.status === 'WARNING' ? '#ff9800' : '#f44336'
                    }`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', fontWeight: 'bold' }}>
                        {event.action}
                      </span>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: event.status === 'SUCCESS' ? '#4caf50' : event.status === 'WARNING' ? '#ff9800' : '#f44336',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {event.status}
                      </span>
                    </div>
                    <div style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '12px', marginBottom: '3px' }}>
                      {event.details}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: darkMode ? '#999999' : '#999999', fontSize: '12px' }}>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                      <span>Duration: {event.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  alert(`Timeline Replay Report Generated for ${selectedReplay.agentId}\n\nTotal Duration: ${selectedReplay.totalDuration}\nSuccess Rate: ${selectedReplay.successRate}\nError Count: ${selectedReplay.errorCount}\n\nThis would generate a comprehensive timeline replay report.`);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Generate Replay Report
              </button>
              <button
                onClick={() => { setShowReplayModal(false); setReplayProgress(0); setReplayPlaying(false); }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Agent Replay Modal */}
      {showMultiAgentReplayModal && multiAgentData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '30px',
            borderRadius: '8px',
            width: '900px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: darkMode ? '#ffffff' : '#333333', fontSize: '18px' }}>
              Multi-Agent Replay - Comparative Analysis
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                System Metrics:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                {Object.entries(multiAgentData.comparativeMetrics).map(([key, value]) => (
                  <div key={key} style={{ 
                    padding: '12px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '12px', marginBottom: '5px' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div style={{ color: '#9c27b0', fontSize: '18px', fontWeight: 'bold' }}>
                      {typeof value === 'number' ? `${value}%` : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Agent Status Comparison:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {multiAgentData.agents.map((agent, idx) => (
                  <div key={idx} style={{ 
                    padding: '15px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px',
                    border: `2px solid ${
                      agent.status === 'ACTIVE' ? '#4caf50' : 
                      agent.status === 'WARNING' ? '#ff9800' : '#f44336'
                    }`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '14px', fontWeight: 'bold' }}>
                        {agent.agentId}
                      </span>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: agent.status === 'ACTIVE' ? '#4caf50' : agent.status === 'WARNING' ? '#ff9800' : '#f44336',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '12px', marginBottom: '5px' }}>
                      {agent.department}
                    </div>
                    <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '12px', marginBottom: '5px' }}>
                      {agent.currentAction}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        height: '6px', 
                        backgroundColor: darkMode ? '#404040' : '#e0e0e0', 
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginBottom: '3px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${agent.progress}%`,
                          backgroundColor: '#9c27b0',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <div style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '11px', textAlign: 'right' }}>
                        {agent.progress}% Complete
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '11px', color: darkMode ? '#cccccc' : '#666666' }}>
                      <div>Tasks: {agent.metrics.tasksCompleted}</div>
                      <div>Accuracy: {agent.metrics.accuracy}%</div>
                      <div>Response: {agent.metrics.responseTime}ms</div>
                      <div>Efficiency: {Math.floor(agent.metrics.accuracy * agent.progress / 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: darkMode ? '#cccccc' : '#666666', fontSize: '14px' }}>
                Deployment Timeline:
              </h4>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {multiAgentData.timeline.map((event, idx) => (
                  <div key={idx} style={{ 
                    padding: '10px', 
                    backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5', 
                    borderRadius: '4px',
                    minWidth: '120px',
                    textAlign: 'center',
                    border: `2px solid ${
                      event.status === 'ACTIVE' ? '#4caf50' : 
                      event.status === 'SUCCESS' ? '#2196f3' : '#666666'
                    }`
                  }}>
                    <div style={{ color: darkMode ? '#9c27b0' : '#9c27b0', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {event.time}
                    </div>
                    <div style={{ color: darkMode ? '#ffffff' : '#333333', fontSize: '11px' }}>
                      {event.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  alert(`Multi-Agent Replay Report Generated\n\nSystem Metrics:\n- Average Accuracy: ${multiAgentData.comparativeMetrics.averageAccuracy}%\n- Total Tasks: ${multiAgentData.comparativeMetrics.totalTasksCompleted}\n- System Efficiency: ${multiAgentData.comparativeMetrics.systemEfficiency}%\n- Compliance Rate: ${multiAgentData.comparativeMetrics.complianceRate}%\n\nThis would generate a comprehensive multi-agent comparative analysis report.`);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px'
                }}
              >
                Generate Comparative Report
              </button>
              <button
                onClick={() => { setShowMultiAgentReplayModal(false); }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HR Head Chat Bot Modal */}
      {showHRChatBot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            padding: '0',
            borderRadius: '12px',
            width: '400px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Chat Header */}
            <div style={{
              backgroundColor: '#4caf50',
              padding: '15px',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>
                {chatMessages.length > 0 && chatMessages[0].sender === 'bot' ? chatMessages[0].message : 'HR Assistant'}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    title: 'Chat history (last 5 sessions)'
                  }}
                >
                  H
                </button>
                <button
                  onClick={() => setShowHRChatBot(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat History Panel */}
            {showHistory && (
              <div style={{
                backgroundColor: darkMode ? '#f5f5f5' : '#f8f9fa',
                padding: '15px',
                borderBottom: `1px solid ${darkMode ? '#404040' : '#ddd'}`,
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px', color: darkMode ? '#333333' : '#666666' }}>
                  Chat History (Last 5 Sessions)
                </div>
                {chatHistory.map((session) => (
                  <div key={session.id} style={{
                    padding: '8px',
                    backgroundColor: darkMode ? '#ffffff' : '#ffffff',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    border: `1px solid ${darkMode ? '#e0e0e0' : '#ddd'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '500', color: darkMode ? '#333333' : '#666666' }}>
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        color: session.hasProof ? '#4caf50' : '#999999',
                        backgroundColor: session.hasProof ? '#e8f5e8' : '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}>
                        {session.hasProof ? '📄 Proof' : '💬 Chat'}
                      </span>
                    </div>
                    <div style={{ color: darkMode ? '#666666' : '#999999', fontSize: '11px' }}>
                      {session.messageCount} messages • Last: {session.lastMessage.substring(0, 50)}{session.lastMessage.length > 50 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Messages Area */}
            <div style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {chatMessages.slice(1).map((msg) => ( // Skip greeting, show only conversation
                <div key={msg.id} style={{
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '8px 12px',
                    borderRadius: '15px',
                    backgroundColor: msg.sender === 'user' ? '#4caf50' : (darkMode ? '#404040' : '#e3f2fd'),
                    color: msg.sender === 'user' ? 'white' : (darkMode ? '#ffffff' : '#333333'),
                    fontSize: '13px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {msg.sender === 'bot' && (
                      <div>
                        <div>{msg.message}</div>
                        {msg.actions && msg.actions.length > 0 && (
                          <button
                            onClick={() => generateProofPopup(msg)}
                            style={{
                              padding: '3px 6px',
                              backgroundColor: '#ff6b35',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              marginTop: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            title="Generate proof popup - Non-invasive action"
                          >
                            📄 Proof
                          </button>
                        )}
                      </div>
                    )}
                    {msg.sender === 'user' && msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Area */}
            <div style={{
              padding: '15px 20px',
              borderTop: `1px solid ${darkMode ? '#404040' : '#ddd'}`,
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message or use voice..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px',
                  backgroundColor: darkMode ? '#f5f5f5' : '#f8f9fa',
                  color: darkMode ? '#333333' : '#333333',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleVoiceInput}
                disabled={!voiceSupported}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: isListening ? '#ff9800' : '#2196f3',
                  color: 'white',
                  border: 'none',
                  cursor: voiceSupported ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                🎤
              </button>
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

// Render the app to the DOM
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
