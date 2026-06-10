// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  endpoints: {
    login: '/auth/login',
    profile: '/auth/profile',
    dashboard: '/dashboard/stats'
  }
};

// Helper function untuk fetch dengan auth header
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

// API Functions
const API = {
  async login(username, password) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.login}`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  async getProfile() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.profile}`);
  },
  
  async getDashboardStats(startDate = null, endDate = null) {
    let url = `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.dashboard}`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }
    return fetchWithAuth(url);
  }
};