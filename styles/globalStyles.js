import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@constants/colors";
import {
  FONT_SIZES,
  FONT_WEIGHTS,
  FONT_FAMILIES,
  TEXT_STYLES,
} from "@constants/typography";

const { width, height } = Dimensions.get("window");

// Modern Spacing System (8px base grid)
export const SPACING = {
  xs: 4, // 0.5 * base
  sm: 8, // 1 * base
  md: 16, // 2 * base
  lg: 24, // 3 * base
  xl: 32, // 4 * base
  xxl: 48, // 6 * base (updated)
  xxxl: 64, // 8 * base (new)

  // Component-specific spacing
  cardPadding: 20,
  screenPadding: 24,
  sectionSpacing: 32,
  elementSpacing: 12,
};

// Re-export typography constants for convenience
export { FONT_SIZES, FONT_WEIGHTS, FONT_FAMILIES, TEXT_STYLES };

// Modern Border Radius (Airbnb-inspired)
export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12, // Standard for cards, buttons
  lg: 16, // Larger components
  xl: 24, // Special elements
  xxl: 32, // Very large elements
  full: 9999, // Pills, circular elements
};

// Modern Shadow System (subtle, Airbnb-inspired)
export const SHADOWS = {
  // Subtle shadow for floating elements
  subtle: {
    shadowColor: COLORS.gray800,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },

  // Small shadow for cards
  small: {
    shadowColor: COLORS.gray800,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  // Medium shadow for modals, dropdowns
  medium: {
    shadowColor: COLORS.gray800,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },

  // Large shadow for major UI elements
  large: {
    shadowColor: COLORS.gray800,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },

  // Extra large shadow for overlays
  xlarge: {
    shadowColor: COLORS.gray800,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  padding: {
    padding: SPACING.md,
  },

  paddingHorizontal: {
    paddingHorizontal: SPACING.md,
  },

  paddingVertical: {
    paddingVertical: SPACING.md,
  },

  margin: {
    margin: SPACING.md,
  },

  marginHorizontal: {
    marginHorizontal: SPACING.md,
  },

  marginVertical: {
    marginVertical: SPACING.md,
  },

  // Modern Text Styles (using new typography system)
  displayLarge: {
    ...TEXT_STYLES.displayLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  displayMedium: {
    ...TEXT_STYLES.displayMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  heading1: {
    ...TEXT_STYLES.heading1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  heading2: {
    ...TEXT_STYLES.heading2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  heading3: {
    ...TEXT_STYLES.heading3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  heading4: {
    ...TEXT_STYLES.heading4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  bodyLarge: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
  },

  body: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },

  bodySmall: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },

  caption: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },

  overline: {
    ...TEXT_STYLES.overline,
    color: COLORS.textSecondary,
  },

  link: {
    ...TEXT_STYLES.link,
    color: COLORS.link,
  },

  // Legacy support (keeping for backward compatibility)
  h1: {
    ...TEXT_STYLES.heading1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  h2: {
    ...TEXT_STYLES.heading2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  h3: {
    ...TEXT_STYLES.heading3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  bodyText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },

  captionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },

  // Layout helpers
  row: {
    flexDirection: "row",
  },

  column: {
    flexDirection: "column",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  spaceBetween: {
    justifyContent: "space-between",
  },

  alignCenter: {
    alignItems: "center",
  },

  justifyCenter: {
    justifyContent: "center",
  },

  // Modern Card Styles
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.cardPadding,
    marginVertical: SPACING.sm,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardLarge: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardCompact: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    ...SHADOWS.subtle,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  // Modern Button Styles
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.elementSpacing,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    ...SHADOWS.subtle,
  },

  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.elementSpacing,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },

  buttonText: {
    ...TEXT_STYLES.button,
    color: COLORS.textInverse,
  },

  buttonSecondaryText: {
    ...TEXT_STYLES.button,
    color: COLORS.textPrimary,
  },

  // Modern Input Styles
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.elementSpacing,
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    minHeight: 48,
  },

  inputFocused: {
    borderColor: COLORS.borderFocus,
    ...SHADOWS.subtle,
  },

  // Modern Container Styles
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screenPadding,
  },

  sectionContainer: {
    marginBottom: SPACING.sectionSpacing,
  },

  listContainer: {
    paddingVertical: SPACING.md,
  },
});
