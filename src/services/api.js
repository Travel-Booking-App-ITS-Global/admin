/**
 * ITS Global Travel Enterprise Admin API & Authentication Client
 * Features:
 * - JWT Access & Refresh Token Lifecycle Management
 * - Automatic Silent Token Refresh with Mutex / In-flight Promise Sharing
 * - Resilient Error Handling & Normalization
 * - Multi-tab Session Synchronization via Custom Events
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const TOKEN_KEY = 'its_admin_access_token';
export const REFRESH_TOKEN_KEY = 'its_admin_refresh_token';
export const USER_KEY = 'its_admin_user_data';

// Concurrency queue for seamless token refresh
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
}

/**
 * Decode JWT token safely without external dependencies
 */
export function decodeJwt(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token, bufferSeconds = 30) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= (decoded.exp - bufferSeconds) * 1000;
}

/**
 * Core HTTP Request Wrapper with Auto Authorization & Token Refresh
 */
export async function apiRequest(endpoint, options = {}, isRetry = false) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  let token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  // If token is about to expire and we have a refresh token, proactively refresh
  if (token && refreshToken && isTokenExpired(token) && !endpoint.includes('/auth/')) {
    try {
      token = await authService.refreshAccessToken();
    } catch {
      // Proceed with existing token; if it fails, 401 handler will catch it
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle 401 Unauthorized with Automatic Token Refresh
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login')) {
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newAccessToken = await authService.refreshAccessToken();
            isRefreshing = false;
            onRefreshed(newAccessToken);
            return apiRequest(endpoint, options, true);
          } catch (refreshErr) {
            isRefreshing = false;
            refreshSubscribers = [];
            authService.logout();
            throw refreshErr;
          }
        } else {
          // Wait in queue until current refresh finishes
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((newToken) => {
              if (newToken) {
                resolve(apiRequest(endpoint, options, true));
              } else {
                reject(new Error('Session expired. Please log in again.'));
              }
            });
          });
        }
      } else {
        authService.logout();
      }
    }

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred.';
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      const netErr = new Error('Cannot connect to backend server. Please verify the server is running on ' + API_BASE_URL);
      netErr.status = 0;
      throw netErr;
    }
    throw err;
  }
}

/**
 * Enterprise Admin Authentication Service
 */
export const authService = {
  /**
   * Login Admin with email & password
   */
  async login(email, password) {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
    };

    const res = await apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const resultData = res?.data || res;
    const { tokens, user } = resultData;

    if (tokens?.accessToken) {
      localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    }
    if (tokens?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem('its_admin_name', user.name || 'Admin');
      localStorage.setItem('its_admin_email', user.email || email);
      if (user.avatar) localStorage.setItem('its_admin_avatar', user.avatar);
      if (user.role) localStorage.setItem('its_admin_role', user.role);
    }

    window.dispatchEvent(new CustomEvent('auth:login', { detail: user }));
    return resultData;
  },

  /**
   * Silent Access Token Refresh
   */
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const res = await fetch(`${API_BASE_URL}/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      this.logout();
      throw new Error('Refresh token invalid or expired');
    }

    const json = await res.json();
    const data = json?.data || json;
    const newAccessToken = data?.tokens?.accessToken || data?.accessToken;
    const newRefreshToken = data?.tokens?.refreshToken || data?.refreshToken;

    if (newAccessToken) {
      localStorage.setItem(TOKEN_KEY, newAccessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }

    return newAccessToken;
  },

  /**
   * Send Forgot Password email link
   */
  async forgotPassword(email) {
    return apiRequest('/admin/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  },

  /**
   * Reset Admin Password with token
   */
  async resetPassword(email, token, newPassword) {
    return apiRequest('/admin/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        token,
        newPassword,
      }),
    });
  },

  /**
   * Universal Logout
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },

  /**
   * Get Current Access Token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get Current Refresh Token
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Get Current Stored Admin User
   */
  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if User is Authenticated & Token Not Expired
   */
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token && !refreshToken) return false;
    if (token && !isTokenExpired(token)) return true;
    return Boolean(refreshToken);
  },
};

export default {
  API_BASE_URL,
  apiRequest,
  authService,
  decodeJwt,
  isTokenExpired,
};
