import axios from 'axios';

const API_URL = '/api';

// Login user and return user data with token
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Authentication failed' };
  }
};

// Client login with email only
export const clientLogin = async (email, marketingConsent = true) => {
  try {
    const response = await axios.post(`${API_URL}/auth/client-login`, {
      email,
      marketingConsent
    });
    
    if (response.data && response.data.token) {
      const userData = {
        ...response.data,
        isClient: true
      };
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Client login error:', error);
    throw error.response?.data || { message: 'Authentication failed' };
  }
};

// Logout user by removing from localStorage
export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    // Check if token exists and is not expired
    // For a more complete solution, you could decode the JWT and check its expiration
    if (user && user.token) {
      return user;
    }
    return null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    localStorage.removeItem('user');
    return null;
  }
}; 