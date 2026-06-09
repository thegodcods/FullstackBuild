import { API_ENDPOINTS } from '../config/api';

export const authService = {
  // Register user
  register: async (username, email, password, passwordConfirm) => {
    try {
      if (password !== passwordConfirm) {
        return { 
          success: false, 
          error: { message: 'Passwords do not match' } 
        };
      }

      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: {
            token: data.token || '',
            user: {
              id: data.user?.id || '',
              username: data.user?.username || username,
              email: data.user?.email || email,
            },
          },
        };
      } else {
        return {
          success: false,
          error: data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || 'Registration failed' },
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: {
            token: data.token,
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            },
          },
        };
      } else {
        return {
          success: false,
          error: data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || 'Login failed' },
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      return { success: response.ok };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.GET_PROFILE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          error: data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || 'Failed to fetch profile' },
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          error: data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || 'Failed to update profile' },
      };
    }
  },
};

export default authService;
