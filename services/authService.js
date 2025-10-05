import apiClient from "./apiClient";
import { API_CONFIG, APP_CONFIG } from "@constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.success || response.token) {
        const token = response.token || response.data?.token;
        const user = response.user || response.data?.user;

        // Store token in AsyncStorage
        await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);

        // Set token in API client for future requests
        apiClient.setAuthToken(token);

        return {
          success: true,
          token,
          user,
        };
      }

      throw new Error(response.message || "Login failed");
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      if (response.success || response.token) {
        const token = response.token || response.data?.token;
        const user = response.user || response.data?.user;

        // Store token in AsyncStorage
        await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);

        // Set token in API client for future requests
        apiClient.setAuthToken(token);

        return {
          success: true,
          token,
          user,
        };
      }

      throw new Error(response.message || "Registration failed");
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Call logout endpoint if available
      try {
        await apiClient.authRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
          method: "POST",
        });
      } catch (logoutError) {
        // Continue with local logout even if API call fails
        console.warn("Logout API call failed:", logoutError.message);
      }

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);

      // Clear token from API client
      apiClient.setAuthToken(null);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiClient.authRequest(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        {
          method: "GET",
        }
      );

      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const currentToken = await AsyncStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN
      );

      if (!currentToken) {
        throw new Error("No token available to refresh");
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        token: currentToken,
      });

      if (response.success || response.token) {
        const newToken = response.token || response.data?.token;

        // Store new token in AsyncStorage
        await AsyncStorage.setItem(
          APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN,
          newToken
        );

        // Set new token in API client
        apiClient.setAuthToken(newToken);

        return {
          success: true,
          token: newToken,
        };
      }

      throw new Error(response.message || "Token refresh failed");
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Validate token
  async validateToken(token) {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        success: true,
        valid: true,
        user: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
        error: error.message,
      };
    }
  }

  // Initialize authentication (load stored token)
  async initializeAuth() {
    try {
      const token = await AsyncStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN
      );

      if (token) {
        // Set token in API client
        apiClient.setAuthToken(token);

        // Validate token
        const validation = await this.validateToken(token);

        if (validation.valid) {
          return {
            success: true,
            token,
            user: validation.user,
          };
        } else {
          // Token is invalid, remove it
          await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
          apiClient.setAuthToken(null);
        }
      }

      return {
        success: true,
        token: null,
        user: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
