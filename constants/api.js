// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://your-api-url.com/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,

  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh",
      PROFILE: "/auth/profile",
    },

    // Tasks
    TASKS: {
      LIST: "/tasks",
      CREATE: "/tasks",
      UPDATE: "/tasks",
      DELETE: "/tasks",
      BY_ID: "/tasks/:id",
    },

    // Rooms
    ROOMS: {
      LIST: "/rooms",
      STATUS: "/rooms/status",
      UPDATE_STATUS: "/rooms/:id/status",
    },

    // Staff
    STAFF: {
      LIST: "/staff",
      CONTACTS: "/staff/contacts",
      SHIFTS: "/staff/shifts",
    },

    // Calendar
    CALENDAR: {
      SHIFTS: "/calendar/shifts",
      ABSENCES: "/calendar/absences",
    },

    // Messages
    MESSAGES: {
      LIST: "/messages",
      SEND: "/messages",
      SEARCH: "/messages/search",
    },
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: "Elvira App",
  VERSION: "1.0.0",
  PAGINATION_LIMIT: 20,

  // Feature flags
  FEATURES: {
    DARK_MODE: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: false,
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "@elvira_auth_token",
    USER_PREFERENCES: "@elvira_user_preferences",
    OFFLINE_DATA: "@elvira_offline_data",
  },
};
