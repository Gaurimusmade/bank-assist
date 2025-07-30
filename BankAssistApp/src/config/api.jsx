// Import environment variables from our simple config
import { API_BASE_URL, API_EMPLOYEE_URL, API_SCAN_URL } from '@env';
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_EMPLOYEE_URL:', API_EMPLOYEE_URL);
console.log('API_SCAN_URL:', API_SCAN_URL);

// API Configuration
export const API_CONFIG = {
  // Use environment variables with fallbacks
  BASE_URL: API_BASE_URL,
  EMPLOYEE_URL: API_EMPLOYEE_URL, 
  SCAN_URL: API_SCAN_URL,
  
  // API Endpoints
  ENDPOINTS: {
    TICKETS: '/tickets/',
    TICKET_HISTORY: '/ticket-history/',
    ACTION_TAKEN_DETAILS: '/action-taken-details/',
    UPLOAD_FILES: '/upload-files/',
    APPEAL: '/tickets/appeal/',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get employee API URL
export const getEmployeeApiUrl = (endpoint) => {
  return `${API_CONFIG.EMPLOYEE_URL}${endpoint}`;
};

// Helper function to get scan URL
export const getScanUrl = (ticketId) => {
  return `${API_CONFIG.SCAN_URL}/ticket/${btoa(ticketId.toString())}`;
};

// Test function to verify environment variables are loaded
export const testEnvVariables = () => {
  const envVars = {
    API_BASE_URL: API_BASE_URL,
    API_EMPLOYEE_URL: API_EMPLOYEE_URL,
    API_SCAN_URL: API_SCAN_URL
  };
  
  const hasEnvVars = Object.values(envVars).some(value => value !== undefined);
  
  if (hasEnvVars) {
    console.log('Environment variables loaded successfully:', envVars);
  } else {
    console.log('Environment variables not loaded. Using fallback values.');
  }
  
  return hasEnvVars;
};

// Call test function immediately
testEnvVariables(); 