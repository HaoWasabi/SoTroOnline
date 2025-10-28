// Future authentication utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Get JWT token from localStorage or session
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
  return null;
};

// Create authenticated headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Authenticated fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
  
  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    
    // Redirect to login page
    window.location.href = '/login-page';
    throw new Error('Authentication required');
  }
  
  return response;
};

// OAuth2 login redirect
export const initiateOAuth2Login = () => {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};