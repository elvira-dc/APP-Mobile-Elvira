// Modern Theme Configuration (Airbnb-inspired)
import { COLORS } from "./colors";
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  TEXT_STYLES,
} from "./typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";

// Light Theme (default)
export const lightTheme = {
  colors: COLORS,
  typography: {
    families: FONT_FAMILIES,
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
    styles: TEXT_STYLES,
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

// Dark Theme (for future implementation)
export const darkTheme = {
  colors: {
    ...COLORS,
    // Override colors for dark theme
    primary: "#FF5A5F",
    background: "#000000",
    backgroundSecondary: "#111111",
    surface: "#1A1A1A",

    // Dark theme text colors
    textPrimary: "#FFFFFF",
    textSecondary: "#BBBBBB",
    textTertiary: "#717171",
    textDisabled: "#484848",

    // Dark theme borders
    border: "#333333",
    borderLight: "#2A2A2A",
    borderDark: "#444444",

    // Dark theme grays (inverted)
    gray50: "#1A1A1A",
    gray100: "#2A2A2A",
    gray200: "#333333",
    gray300: "#404040",
    gray400: "#4A4A4A",
    gray500: "#666666",
    gray600: "#888888",
    gray700: "#BBBBBB",
    gray800: "#DDDDDD",
  },
  typography: {
    families: FONT_FAMILIES,
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
    styles: TEXT_STYLES,
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

// Default export (light theme)
export default lightTheme;

// Theme utilities
export const getTheme = (isDark = false) => {
  return isDark ? darkTheme : lightTheme;
};

// Component-specific theme configurations
export const componentThemes = {
  // Button variants
  buttons: {
    primary: {
      backgroundColor: COLORS.primary,
      textColor: COLORS.textInverse,
      borderColor: "transparent",
    },
    secondary: {
      backgroundColor: COLORS.surface,
      textColor: COLORS.textPrimary,
      borderColor: COLORS.border,
    },
    outline: {
      backgroundColor: "transparent",
      textColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: COLORS.textPrimary,
      borderColor: "transparent",
    },
    danger: {
      backgroundColor: COLORS.error,
      textColor: COLORS.textInverse,
      borderColor: "transparent",
    },
  },

  // Card variants
  cards: {
    default: {
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
      shadow: SHADOWS.small,
    },
    elevated: {
      backgroundColor: COLORS.surface,
      borderColor: "transparent",
      shadow: SHADOWS.medium,
    },
    outlined: {
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
      shadow: SHADOWS.subtle,
    },
  },

  // Input variants
  inputs: {
    default: {
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
      textColor: COLORS.textPrimary,
    },
    filled: {
      backgroundColor: COLORS.backgroundSecondary,
      borderColor: "transparent",
      textColor: COLORS.textPrimary,
    },
    outlined: {
      backgroundColor: "transparent",
      borderColor: COLORS.border,
      textColor: COLORS.textPrimary,
    },
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Animation timing
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,

  // Easing curves
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};
