module.exports = {
  clearMocks: true,
  injectGlobals: true,
  preset: 'ts-jest',
  projects: ['<rootDir>/packages/**/jest.config.js'],
  testEnvironment: 'node',
  testMatch: ['*.test.ts', '*.test.tsx']
}
