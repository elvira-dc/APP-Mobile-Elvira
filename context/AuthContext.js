import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "@constants/api";
import {
  POSITIONS,
  DEPARTMENTS,
  getRolePermissions,
  hasPermission,
  isHotelAdmin,
  isHotelStaff,
} from "@constants/userTypes";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_TOKEN: "SET_TOKEN",
  SET_ERROR: "SET_ERROR",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      const token = await AsyncStorage.getItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN
      );

      if (token) {
        dispatch({ type: ActionTypes.SET_TOKEN, payload: token });
        // TODO: Validate token and get user data
        // For now, just set loading to false
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: "Failed to load authentication data",
      });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      // TODO: Implement actual login API call
      // const response = await authService.login(email, password);

      // Mock login for now
      const mockUser = { id: 1, email, name: "John Doe" };
      const mockToken = "mock-jwt-token";

      await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, mockToken);

      dispatch({ type: ActionTypes.SET_TOKEN, payload: mockToken });
      dispatch({ type: ActionTypes.SET_USER, payload: mockUser });

      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      dispatch({ type: ActionTypes.LOGOUT });
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: "Failed to logout" });
      return { success: false, error: "Failed to logout" };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      // TODO: Implement actual registration API call
      // const response = await authService.register(userData);

      // Mock registration for now
      const mockUser = { id: 1, ...userData };
      const mockToken = "mock-jwt-token";

      await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, mockToken);

      dispatch({ type: ActionTypes.SET_TOKEN, payload: mockToken });
      dispatch({ type: ActionTypes.SET_USER, payload: mockUser });

      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Role management functions
  const getUserPermissions = () => {
    if (!state.user?.position) return [];
    return getRolePermissions(state.user.position, state.user.department);
  };

  const checkPermission = (permission) => {
    return hasPermission(state.user, permission);
  };

  const checkIsHotelAdmin = () => {
    return isHotelAdmin(state.user);
  };

  const checkIsHotelStaff = () => {
    return isHotelStaff(state.user);
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    clearError,
    // Role management functions
    getUserPermissions,
    checkPermission,
    checkIsHotelAdmin,
    checkIsHotelStaff,
    // User type constants for easy access
    POSITIONS,
    DEPARTMENTS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
