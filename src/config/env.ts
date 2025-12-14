/**
 * Environment configuration
 * Centralizes access to environment variables with type safety
 */

interface EnvConfig {
  convexUrl: string;
  msal: {
    clientId: string;
    authority: string;
    redirectUri: string;
  };
  appEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Get environment variable with validation
 * @param key - Environment variable key
 * @param defaultValue - Optional default value
 * @returns The environment variable value
 * @throws Error if variable is not set and no default provided
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env file and ensure ${key} is set.`
    );
  }
  
  return value;
}

/**
 * Environment configuration object
 * All environment variables are accessed through this centralized configuration
 */
export const env: EnvConfig = {
  convexUrl: getEnvVar('VITE_CONVEX_URL', ''),
  msal: {
    clientId: getEnvVar('VITE_MSAL_CLIENT_ID', ''),
    authority: getEnvVar('VITE_MSAL_AUTHORITY', ''),
    redirectUri: getEnvVar('VITE_MSAL_REDIRECT_URI', 'http://localhost:5173'),
  },
  appEnv: getEnvVar('VITE_APP_ENV', 'development') as EnvConfig['appEnv'],
  isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production',
  isTest: getEnvVar('VITE_APP_ENV', 'development') === 'test',
};

/**
 * Validate that all required environment variables are set
 * Call this on app initialization
 */
export function validateEnv(): void {
  const errors: string[] = [];
  
  if (!env.convexUrl && env.isProduction) {
    errors.push('VITE_CONVEX_URL is required in production');
  }
  
  if (!env.msal.clientId && env.isProduction) {
    errors.push('VITE_MSAL_CLIENT_ID is required in production');
  }
  
  if (!env.msal.authority && env.isProduction) {
    errors.push('VITE_MSAL_AUTHORITY is required in production');
  }
  
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    );
  }
}
