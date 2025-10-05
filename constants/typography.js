// Modern Typography System inspired by Airbnb
import { Platform } from "react-native";

// Font Families (Airbnb uses Cereal, we'll use system fonts with fallbacks)
export const FONT_FAMILIES = {
  // Primary font family (clean, modern)
  primary: Platform.select({
    ios: "SF Pro Display", // iOS system font
    android: "Roboto", // Android system font
    default: "System",
  }),

  // Secondary font for body text
  secondary: Platform.select({
    ios: "SF Pro Text", // Better for smaller text on iOS
    android: "Roboto", // Android system font
    default: "System",
  }),

  // Monospace for code/numbers
  monospace: Platform.select({
    ios: "SF Mono",
    android: "Roboto Mono",
    default: "Courier New",
  }),
};

// Font Sizes (Airbnb-inspired scale)
export const FONT_SIZES = {
  // Display sizes (large headings)
  display1: 48, // Hero headlines
  display2: 40, // Large display text
  display3: 32, // Section headers

  // Heading sizes
  h1: 28, // Main page titles
  h2: 24, // Section titles
  h3: 20, // Subsection titles
  h4: 18, // Small headings
  h5: 16, // Minor headings
  h6: 14, // Smallest headings

  // Body text sizes
  bodyLarge: 16, // Large body text
  body: 14, // Standard body text
  bodySmall: 12, // Small body text

  // UI element sizes
  button: 16, // Button text
  caption: 12, // Captions, labels
  overline: 10, // Overlines, tags

  // Legacy support (keeping existing names)
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
};

// Font Weights (Airbnb uses varied weights for hierarchy)
export const FONT_WEIGHTS = {
  thin: "100",
  extraLight: "200",
  light: "300",
  regular: "400", // Default
  medium: "500", // Slightly heavier
  semiBold: "600", // Subheadings
  bold: "700", // Headings
  extraBold: "800", // Strong emphasis
  black: "900", // Heavy display text
};

// Line Heights (for better readability)
export const LINE_HEIGHTS = {
  tight: 1.1, // Display text, headings
  normal: 1.4, // Body text
  relaxed: 1.6, // Large paragraphs
  loose: 1.8, // Very readable text
};

// Letter Spacing (for refined typography)
export const LETTER_SPACING = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
};

// Text Styles (pre-built combinations for consistency)
export const TEXT_STYLES = {
  // Display styles
  displayLarge: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.display1,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.display1 * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  displayMedium: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.display2,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.display2 * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  displaySmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.display3,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.display3 * LINE_HEIGHTS.normal,
  },

  // Heading styles
  heading1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.tight,
  },

  heading2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.normal,
  },

  heading3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.normal,
  },

  heading4: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h4,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.normal,
  },

  // Body styles
  bodyLarge: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.bodyLarge * LINE_HEIGHTS.normal,
  },

  body: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.normal,
  },

  bodySmall: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.bodySmall * LINE_HEIGHTS.normal,
  },

  // UI element styles
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.button * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  buttonSmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.bodySmall * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  caption: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: FONT_SIZES.caption * LINE_HEIGHTS.normal,
  },

  overline: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.overline,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.overline * LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.widest,
    textTransform: "uppercase",
  },

  // Special styles
  link: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.normal,
  },

  tag: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.caption * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Form styles
  label: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: FONT_SIZES.bodySmall * LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Convenient aliases for common usage
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.tight,
  },

  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.normal,
  },

  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.normal,
  },

  // Button variants
  buttonLarge: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.bodyLarge * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  buttonMedium: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: FONT_SIZES.button * LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },
};
