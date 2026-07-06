/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: [
    // This repository's nested config package has duplicate package metadata that causes haste collisions.
    '<rootDir>/config/',
    // Duplicate package metadata in backend integration fixtures is not part of root Jest suite.
    '<rootDir>/backend-integration/config/',
    // Independent bot packages are tested separately and should not be scanned by root Jest.
    '<rootDir>/apps/whatsapp-scraper-bot/',
    '<rootDir>/bots/whatsapp-scraper/',
  ],
  collectCoverageFrom: [
    'functions/**/*.js',
    'app/api/**/*.ts',
    '!**/*.d.ts',
  ],
};

module.exports = config;
