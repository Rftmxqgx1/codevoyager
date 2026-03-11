module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/web/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/web/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/web/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/src/web/**/*.(test|spec).(js|jsx)'
  ],
  collectCoverageFrom: [
    'src/web/**/*.(js|jsx)',
    '!src/web/index.js',
    '!src/web/**/__tests__/**',
    '!src/web/**/*.test.(js|jsx)',
    '!src/web/**/*.spec.(js|jsx)'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testTimeout: 10000,
  verbose: true
};
