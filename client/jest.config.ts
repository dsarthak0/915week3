import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true, // Forces this setting during tests
      },
    },
  },
  moduleNameMapper: {
    // This handles your @/services imports
    '^@/(.*)$': '<rootDir>/src/$1',
    // This stops the CSS @import in LoginPage from crashing the test
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;