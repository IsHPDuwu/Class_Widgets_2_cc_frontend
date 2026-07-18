import axios from 'axios';

// Get CSRF token from cookies if available
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const apiClient = axios.create({
  baseURL: '/api/v1/',
  withCredentials: true, // Send cookies for Django Session Auth
});

// Interceptor to add CSRF token to headers
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export default apiClient;
