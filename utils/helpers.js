import { Platform } from "react-native";

// Date and time utilities
export const formatDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "HH:MM":
      return `${hours}:${minutes}`;
    case "HH:MM:SS":
      return `${hours}:${minutes}:${seconds}`;
    case "YYYY-MM-DD HH:MM":
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case "DD/MM/YYYY HH:MM":
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return d.toLocaleDateString();
  }
};

export const getRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export const isToday = (date) => {
  if (!date) return false;

  const today = new Date();
  const checkDate = new Date(date);

  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getEndOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6;
  return new Date(d.setDate(diff));
};

// String utilities
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Array utilities
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};

  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = "asc") => {
  if (!array || !Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (direction === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const unique = (array, key = null) => {
  if (!array || !Array.isArray(array)) return [];

  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  return [...new Set(array)];
};

// Object utilities
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return false;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;

  return false;
};

export const pick = (obj, keys) => {
  if (!obj || typeof obj !== "object") return {};

  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
};

export const omit = (obj, keys) => {
  if (!obj || typeof obj !== "object") return {};

  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

// Number utilities
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (typeof amount !== "number") return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (number, decimals = 0) => {
  if (typeof number !== "number") return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// Platform utilities
export const isIOS = () => {
  return Platform.OS === "ios";
};

export const isAndroid = () => {
  return Platform.OS === "android";
};

// Async utilities
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
