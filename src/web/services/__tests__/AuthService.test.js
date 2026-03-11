import authService from '../AuthService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    authService.logout();
  });

  describe('Authentication', () => {
    it('should login with valid admin credentials', async () => {
      const result = await authService.login({ username: 'admin', password: 'admin123' });
      
      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result.role).toBe('admin');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should login with valid manager credentials', async () => {
      const result = await authService.login({ username: 'manager', password: 'manager123' });
      
      expect(result).toBeDefined();
      expect(result.username).toBe('manager');
      expect(result.role).toBe('manager');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should login with valid analyst credentials', async () => {
      const result = await authService.login({ username: 'analyst', password: 'analyst123' });
      
      expect(result).toBeDefined();
      expect(result.username).toBe('analyst');
      expect(result.role).toBe('analyst');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should login with valid operator credentials', async () => {
      const result = await authService.login({ username: 'operator', password: 'operator123' });
      
      expect(result).toBeDefined();
      expect(result.username).toBe('operator');
      expect(result.role).toBe('operator');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should login with valid viewer credentials', async () => {
      const result = await authService.login({ username: 'viewer', password: 'viewer123' });
      
      expect(result).toBeDefined();
      expect(result.username).toBe('viewer');
      expect(result.role).toBe('viewer');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should reject invalid credentials', async () => {
      await expect(authService.login({ username: 'invalid', password: 'invalid' }))
        .rejects.toThrow('Invalid credentials');
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should logout correctly', () => {
      authService.login({ username: 'admin', password: 'admin123' });
      expect(authService.isAuthenticated()).toBe(true);
      
      authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getCurrentUser()).toBeNull();
    });
  });

  describe('Permissions', () => {
    it('should grant all permissions to admin', () => {
      authService.login({ username: 'admin', password: 'admin123' });
      
      expect(authService.hasPermission('dashboard:view')).toBe(true);
      expect(authService.hasPermission('scraping:start')).toBe(true);
      expect(authService.hasPermission('system:configure')).toBe(true);
    });

    it('should grant limited permissions to manager', () => {
      authService.login({ username: 'manager', password: 'manager123' });
      
      expect(authService.hasPermission('dashboard:view')).toBe(true);
      expect(authService.hasPermission('scraping:start')).toBe(true);
      expect(authService.hasPermission('system:configure')).toBe(false);
    });

    it('should grant limited permissions to analyst', () => {
      authService.login({ username: 'analyst', password: 'analyst123' });
      
      expect(authService.hasPermission('dashboard:view')).toBe(true);
      expect(authService.hasPermission('scraping:start')).toBe(false);
      expect(authService.hasPermission('scraping:queue')).toBe(true);
    });

    it('should grant limited permissions to operator', () => {
      authService.login({ username: 'operator', password: 'operator123' });
      
      expect(authService.hasPermission('dashboard:view')).toBe(true);
      expect(authService.hasPermission('scraping:start')).toBe(true);
      expect(authService.hasPermission('scraping:configure')).toBe(false);
    });

    it('should grant only view permissions to viewer', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      expect(authService.hasPermission('dashboard:view')).toBe(true);
      expect(authService.hasPermission('scraping:start')).toBe(false);
      expect(authService.hasPermission('scraping:configure')).toBe(false);
    });

    it('should check for any permission correctly', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      expect(authService.hasAnyPermission(['dashboard:view', 'scraping:start'])).toBe(true);
      expect(authService.hasAnyPermission(['scraping:start', 'scraping:configure'])).toBe(false);
    });

    it('should check for all permissions correctly', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      expect(authService.hasAllPermissions(['dashboard:view', 'scraping:view'])).toBe(true);
      expect(authService.hasAllPermissions(['dashboard:view', 'scraping:start'])).toBe(false);
    });
  });

  describe('Role Hierarchy', () => {
    it('should check minimum role correctly', () => {
      authService.login({ username: 'operator', password: 'operator123' });
      
      expect(authService.hasMinimumRole('viewer')).toBe(true);
      expect(authService.hasMinimumRole('operator')).toBe(true);
      expect(authService.hasMinimumRole('manager')).toBe(false);
      expect(authService.hasMinimumRole('admin')).toBe(false);
    });

    it('should allow admin to access all roles', () => {
      authService.login({ username: 'admin', password: 'admin123' });
      
      expect(authService.hasMinimumRole('viewer')).toBe(true);
      expect(authService.hasMinimumRole('operator')).toBe(true);
      expect(authService.hasMinimumRole('manager')).toBe(true);
      expect(authService.hasMinimumRole('analyst')).toBe(true);
      expect(authService.hasMinimumRole('admin')).toBe(true);
    });
  });

  describe('User Management', () => {
    it('should get current user', () => {
      authService.login({ username: 'admin', password: 'admin123' });
      
      const user = authService.getCurrentUser();
      expect(user).toBeDefined();
      expect(user.username).toBe('admin');
      expect(user.role).toBe('admin');
    });

    it('should get user role', () => {
      authService.login({ username: 'manager', password: 'manager123' });
      
      expect(authService.getUserRole()).toBe('manager');
    });

    it('should get user permissions', () => {
      authService.login({ username: 'analyst', password: 'analyst123' });
      
      const permissions = authService.getUserPermissions();
      expect(permissions).toContain('dashboard:view');
      expect(permissions).toContain('scraping:view');
      expect(permissions).not.toContain('system:configure');
    });

    it('should update user profile', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      authService.updateProfile({ name: 'Updated Name' });
      
      const user = authService.getCurrentUser();
      expect(user.name).toBe('Updated Name');
    });
  });

  describe('Role Display Names', () => {
    it('should return correct role display names', () => {
      expect(authService.getRoleDisplayName('admin')).toBe('Administrator');
      expect(authService.getRoleDisplayName('manager')).toBe('Manager');
      expect(authService.getRoleDisplayName('analyst')).toBe('Data Analyst');
      expect(authService.getRoleDisplayName('operator')).toBe('Operator');
      expect(authService.getRoleDisplayName('viewer')).toBe('Viewer');
      expect(authService.getRoleDisplayName('unknown')).toBe('Unknown');
    });
  });

  describe('Component Wrappers', () => {
    it('should return component when user has permission', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      const component = <div>Test Component</div>;
      const result = authService.withPermission('dashboard:view', component);
      
      expect(result).toEqual(component);
    });

    it('should return null when user lacks permission', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      const component = <div>Test Component</div>;
      const result = authService.withPermission('scraping:start', component);
      
      expect(result).toBeNull();
    });

    it('should return component when user has minimum role', () => {
      authService.login({ username: 'operator', password: 'operator123' });
      
      const component = <div>Test Component</div>;
      const result = authService.withRole('viewer', component);
      
      expect(result).toEqual(component);
    });

    it('should return null when user lacks minimum role', () => {
      authService.login({ username: 'viewer', password: 'viewer123' });
      
      const component = <div>Test Component</div>;
      const result = authService.withRole('operator', component);
      
      expect(result).toBeNull();
    });
  });
});
