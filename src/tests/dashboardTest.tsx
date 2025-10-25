// Dashboard View Tests

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Mock user data
const mockUser = {
  id: 1,
  username: "CS",
  password: "CSPass",
  name: "Customer Service"
};

// Helper function to simulate user authentication
function simulateUserLogin(user: typeof mockUser) {
  mockLocalStorage.setItem('currentUser', JSON.stringify(user));
  mockLocalStorage.setItem('isLoggedIn', 'true');
}

// Helper function to simulate user logout
function simulateUserLogout() {
  mockLocalStorage.removeItem('currentUser');
  mockLocalStorage.removeItem('isLoggedIn');
}

// Function to get current user from localStorage (simulating the dashboard logic)
function getCurrentUser() {
  const currentUserData = mockLocalStorage.getItem('currentUser');
  return currentUserData ? JSON.parse(currentUserData) : null;
}

// Function to check if user is logged in
function isUserLoggedIn() {
  return mockLocalStorage.getItem('isLoggedIn') === 'true';
}

// Function to filter routes based on user permissions (simulating dashboard logic)
function getAccessibleRoutes(currentUser: typeof mockUser | null) {
  const allRoutes = [
    {
      path: '/CSForm',
      name: 'Customer Request Form',
      allowedUsernames: ['CS'],
      description: 'Customer Request Form'
    },
  ];

  return allRoutes.filter(route => {
    // If no allowedUsernames specified, show to everyone
    if (!route.allowedUsernames || route.allowedUsernames.length === 0) {
      return true;
    }
    // If allowedUsernames specified, check if current user is included
    return currentUser && route.allowedUsernames.includes(currentUser.username);
  });
}

test('should retrieve current user from localStorage correctly', () => {
  // Clear localStorage first
  mockLocalStorage.clear();
  
  // Test when no user is logged in
  expect(getCurrentUser()).toBeNull();
  
  // Simulate user login
  simulateUserLogin(mockUser);
  
  // Test when user is logged in
  const currentUser = getCurrentUser();
  expect(currentUser).not.toBeNull();
  expect(currentUser.username).toBe('CS');
  expect(currentUser.name).toBe('Customer Service');
});

test('should handle user authentication state correctly', () => {
  // Clear localStorage first
  mockLocalStorage.clear();
  
  // Test when user is not logged in
  expect(isUserLoggedIn()).toBe(false);
  
  // Simulate user login
  simulateUserLogin(mockUser);
  
  // Test when user is logged in
  expect(isUserLoggedIn()).toBe(true);
  
  // Simulate user logout
  simulateUserLogout();
  
  // Test after logout
  expect(isUserLoggedIn()).toBe(false);
});

test('should filter routes based on user permissions correctly', () => {
  // Test with CS user - should have access to Customer Request Form
  const csUser = { ...mockUser, username: 'CS' };
  const csRoutes = getAccessibleRoutes(csUser);
  
  expect(csRoutes).toHaveLength(1);
  expect(csRoutes[0].name).toBe('Customer Request Form');
  
  // Test with different user - should not have access
  const otherUser = { ...mockUser, username: 'FM' };
  const fmRoutes = getAccessibleRoutes(otherUser);
  
  expect(fmRoutes).toHaveLength(0);
  
  // Test with null user - should not have access
  const nullUserRoutes = getAccessibleRoutes(null);
  
  expect(nullUserRoutes).toHaveLength(0);
});

test('should handle route access permissions correctly', () => {
  const route = {
    path: '/CSForm',
    name: 'Customer Request Form',
    allowedUsernames: ['CS'],
    description: 'Customer Request Form'
  };
  
  // Test allowed user
  expect(route.allowedUsernames.includes('CS')).toBe(true);
  
  // Test not allowed user
  expect(route.allowedUsernames.includes('FM')).toBe(false);
  expect(route.allowedUsernames.includes('AM')).toBe(false);
});

test('should validate user data structure correctly', () => {
  const user = getCurrentUser();
  
  // First set up a user
  simulateUserLogin(mockUser);
  const loggedInUser = getCurrentUser();
  
  expect(loggedInUser).toHaveProperty('id');
  expect(loggedInUser).toHaveProperty('username');
  expect(loggedInUser).toHaveProperty('name');
  expect(typeof loggedInUser.id).toBe('number');
  expect(typeof loggedInUser.username).toBe('string');
  expect(typeof loggedInUser.name).toBe('string');
});

test('should handle localStorage operations correctly', () => {
  const testData = { test: 'data' };
  
  // Test setItem and getItem
  mockLocalStorage.setItem('testKey', JSON.stringify(testData));
  const retrieved = JSON.parse(mockLocalStorage.getItem('testKey') || '{}');
  expect(retrieved).toEqual(testData);
  
  // Test removeItem
  mockLocalStorage.removeItem('testKey');
  expect(mockLocalStorage.getItem('testKey')).toBeNull();
  
  // Test clear
  mockLocalStorage.setItem('key1', 'value1');
  mockLocalStorage.setItem('key2', 'value2');
  mockLocalStorage.clear();
  expect(mockLocalStorage.getItem('key1')).toBeNull();
  expect(mockLocalStorage.getItem('key2')).toBeNull();
});