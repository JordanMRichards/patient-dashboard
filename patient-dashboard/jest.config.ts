import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})
 
const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  }
}


export default createJestConfig(config)