/** @type {import('ts-jest').JestConfigWithTsJest} */
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ['**/*.spec.ts', '**/*.test.ts'];
export const verbose = true;
export const forceExit = true;
export const clearMocks = true;
export const resetModules = true;
export const restoreMocks = true;
