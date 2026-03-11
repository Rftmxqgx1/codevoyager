class AuthService {
  constructor() {
    this.currentUser = null;
    this.userPermissions = new Map();
    this.roles = {
      ADMIN: 'admin',
      MANAGER: 'manager',
      ANALYST: 'analyst',
      OPERATOR: 'operator',
      VIEWER: 'viewer'
    };
    
    this.roleHierarchy = {
      [this.roles.ADMIN]: 5,
      [this.roles.MANAGER]: 4,
      [this.roles.ANALYST]: 3,
      [this.roles.OPERATOR]: 2,
      [this.roles.VIEWER]: 1
    };

    this.permissions = {
      // Dashboard permissions
      DASHBOARD_VIEW: 'dashboard:view',
      DASHBOARD_EXPORT: 'dashboard:export',
      DASHBOARD_MANAGE: 'dashboard:manage',
      
      // Scraping permissions
      SCRAPING_VIEW: 'scraping:view',
      SCRAPING_START: 'scraping:start',
      SCRAPING_STOP: 'scraping:stop',
      SCRAPING_CONFIGURE: 'scraping:configure',
      SCRAPING_QUEUE: 'scraping:queue',
      
      // Processing permissions
      PROCESSING_VIEW: 'processing:view',
      PROCESSING_START: 'processing:start',
      PROCESSING_CONFIGURE: 'processing:configure',
      PROCESSING_QUALITY: 'processing:quality',
      
      // Creation permissions
      CREATION_VIEW: 'creation:view',
      CREATION_GENERATE: 'creation:generate',
      CREATION_CONFIGURE: 'creation:configure',
      CREATION_TEST: 'creation:test',
      
      // Delivery permissions
      DELIVERY_VIEW: 'delivery:view',
      DELIVERY_PREPARE: 'delivery:prepare',
      DELIVERY_DEPLOY: 'delivery:deploy',
      DELIVERY_SECURITY: 'delivery:security',
      
      // Client permissions
      CLIENTS_VIEW: 'clients:view',
      CLIENTS_MANAGE: 'clients:manage',
      CLIENTS_COMMUNICATE: 'clients:communicate',
      CLIENTS_ANALYTICS: 'clients:analytics',
      
      // System permissions
      SYSTEM_CONFIGURE: 'system:configure',
      SYSTEM_MONITOR: 'system:monitor',
      SYSTEM_BACKUP: 'system:backup',
      SYSTEM_LOGS: 'system:logs'
    };

    this.rolePermissions = {
      [this.roles.ADMIN]: Object.values(this.permissions),
      [this.roles.MANAGER]: [
        this.permissions.DASHBOARD_VIEW,
        this.permissions.DASHBOARD_EXPORT,
        this.permissions.SCRAPING_VIEW,
        this.permissions.SCRAPING_START,
        this.permissions.SCRAPING_STOP,
        this.permissions.SCRAPING_CONFIGURE,
        this.permissions.PROCESSING_VIEW,
        this.permissions.PROCESSING_START,
        this.permissions.PROCESSING_CONFIGURE,
        this.permissions.CREATION_VIEW,
        this.permissions.CREATION_GENERATE,
        this.permissions.CREATION_CONFIGURE,
        this.permissions.DELIVERY_VIEW,
        this.permissions.DELIVERY_PREPARE,
        this.permissions.DELIVERY_DEPLOY,
        this.permissions.CLIENTS_VIEW,
        this.permissions.CLIENTS_MANAGE,
        this.permissions.CLIENTS_COMMUNICATE,
        this.permissions.SYSTEM_MONITOR
      ],
      [this.roles.ANALYST]: [
        this.permissions.DASHBOARD_VIEW,
        this.permissions.DASHBOARD_EXPORT,
        this.permissions.SCRAPING_VIEW,
        this.permissions.SCRAPING_QUEUE,
        this.permissions.PROCESSING_VIEW,
        this.permissions.PROCESSING_QUALITY,
        this.permissions.CREATION_VIEW,
        this.permissions.CREATION_TEST,
        this.permissions.DELIVERY_VIEW,
        this.permissions.CLIENTS_VIEW,
        this.permissions.CLIENTS_ANALYTICS
      ],
      [this.roles.OPERATOR]: [
        this.permissions.DASHBOARD_VIEW,
        this.permissions.SCRAPING_VIEW,
        this.permissions.SCRAPING_START,
        this.permissions.SCRAPING_STOP,
        this.permissions.PROCESSING_VIEW,
        this.permissions.PROCESSING_START,
        this.permissions.CREATION_VIEW,
        this.permissions.CREATION_GENERATE,
        this.permissions.DELIVERY_VIEW,
        this.permissions.DELIVERY_PREPARE
      ],
      [this.roles.VIEWER]: [
        this.permissions.DASHBOARD_VIEW,
        this.permissions.SCRAPING_VIEW,
        this.permissions.PROCESSING_VIEW,
        this.permissions.CREATION_VIEW,
        this.permissions.DELIVERY_VIEW,
        this.permissions.CLIENTS_VIEW
      ]
    };
  }

  // Initialize authentication state
  init() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.updatePermissions();
    }
  }

  // Login with role assignment
  login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication - in production, this would call real auth API
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let foundUser = users.find(u => 
          u.username === credentials.username && u.password === credentials.password
        );
        
        // Default users for demo purposes
        if (!foundUser) {
          if (credentials.username === 'admin' && credentials.password === 'admin123') {
            foundUser = { username: 'admin', role: this.roles.ADMIN, name: 'Administrator' };
          } else if (credentials.username === 'manager' && credentials.password === 'manager123') {
            foundUser = { username: 'manager', role: this.roles.MANAGER, name: 'Manager' };
          } else if (credentials.username === 'analyst' && credentials.password === 'analyst123') {
            foundUser = { username: 'analyst', role: this.roles.ANALYST, name: 'Data Analyst' };
          } else if (credentials.username === 'operator' && credentials.password === 'operator123') {
            foundUser = { username: 'operator', role: this.roles.OPERATOR, name: 'Operator' };
          } else if (credentials.username === 'viewer' && credentials.password === 'viewer123') {
            foundUser = { username: 'viewer', role: this.roles.VIEWER, name: 'Viewer' };
          }
        }
        
        if (foundUser) {
          this.currentUser = {
            ...foundUser,
            id: Math.random().toString(36).substr(2, 9),
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          };
          
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          this.updatePermissions();
          resolve(this.currentUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }

  // Logout
  logout() {
    this.currentUser = null;
    this.userPermissions.clear();
    localStorage.removeItem('user');
  }

  // Update user permissions based on role
  updatePermissions() {
    if (!this.currentUser) return;
    
    const userPermissions = this.rolePermissions[this.currentUser.role] || [];
    this.userPermissions.clear();
    userPermissions.forEach(permission => {
      this.userPermissions.set(permission, true);
    });
  }

  // Check if user has specific permission
  hasPermission(permission) {
    return this.userPermissions.has(permission);
  }

  // Check if user has any of specified permissions
  hasAnyPermission(permissions) {
    return permissions.some(permission => this.userPermissions.has(permission));
  }

  // Check if user has all specified permissions
  hasAllPermissions(permissions) {
    return permissions.every(permission => this.userPermissions.has(permission));
  }

  // Check if user has minimum role level
  hasMinimumRole(minimumRole) {
    if (!this.currentUser) return false;
    
    const userLevel = this.roleHierarchy[this.currentUser.role] || 0;
    const requiredLevel = this.roleHierarchy[minimumRole] || 0;
    
    return userLevel >= requiredLevel;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user role
  getUserRole() {
    return this.currentUser?.role || null;
  }

  // Get user permissions
  getUserPermissions() {
    return Array.from(this.userPermissions.keys());
  }

  // Update user profile
  updateProfile(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get role display name
  getRoleDisplayName(role) {
    const roleNames = {
      [this.roles.ADMIN]: 'Administrator',
      [this.roles.MANAGER]: 'Manager',
      [this.roles.ANALYST]: 'Data Analyst',
      [this.roles.OPERATOR]: 'Operator',
      [this.roles.VIEWER]: 'Viewer'
    };
    return roleNames[role] || 'Unknown';
  }

  // Permission-based component wrapper
  withPermission(permission, component) {
    if (this.hasPermission(permission)) {
      return component;
    }
    return null;
  }

  // Role-based component wrapper
  withRole(minimumRole, component) {
    if (this.hasMinimumRole(minimumRole)) {
      return component;
    }
    return null;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
