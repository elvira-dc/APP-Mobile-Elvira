import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const Badge = ({
  text,
  variant = "primary",
  size = "medium",
  type = "text", // "text", "dot", "number"
  count,
  maxCount = 99,
  showZero = false,
  style,
  textStyle,
}) => {
  // Don't render if count is 0 and showZero is false
  if (type === "number" && count === 0 && !showZero) {
    return null;
  }

  // Get variant colors
  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return {
          backgroundColor: COLORS.error,
          textColor: COLORS.textInverse,
        };
      case "warning":
        return {
          backgroundColor: COLORS.warning,
          textColor: COLORS.textInverse,
        };
      case "success":
        return {
          backgroundColor: COLORS.success,
          textColor: COLORS.textInverse,
        };
      case "info":
        return {
          backgroundColor: COLORS.info,
          textColor: COLORS.textInverse,
        };
      case "primary":
        return {
          backgroundColor: COLORS.primary,
          textColor: COLORS.textInverse,
        };
      case "secondary":
        return {
          backgroundColor: COLORS.gray200,
          textColor: COLORS.textPrimary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          textColor: COLORS.textPrimary,
          borderWidth: 1,
          borderColor: COLORS.border,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          textColor: COLORS.textInverse,
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          minHeight: 16,
          minWidth: type === "dot" ? 8 : 16,
          paddingHorizontal: type === "dot" ? 0 : SPACING.xs,
          paddingVertical: 2,
          borderRadius: type === "dot" ? 4 : BORDER_RADIUS.sm,
        };
      case "medium":
        return {
          minHeight: 20,
          minWidth: type === "dot" ? 12 : 20,
          paddingHorizontal: type === "dot" ? 0 : SPACING.sm,
          paddingVertical: 2,
          borderRadius: type === "dot" ? 6 : BORDER_RADIUS.md,
        };
      case "large":
        return {
          minHeight: 24,
          minWidth: type === "dot" ? 16 : 24,
          paddingHorizontal: type === "dot" ? 0 : SPACING.md,
          paddingVertical: SPACING.xs,
          borderRadius: type === "dot" ? 8 : BORDER_RADIUS.md,
        };
      default:
        return {
          minHeight: 20,
          minWidth: type === "dot" ? 12 : 20,
          paddingHorizontal: type === "dot" ? 0 : SPACING.sm,
          paddingVertical: 2,
          borderRadius: type === "dot" ? 6 : BORDER_RADIUS.md,
        };
    }
  };

  // Get text size based on badge size
  const getTextSize = () => {
    switch (size) {
      case "small":
        return { fontSize: 10, fontWeight: "600" };
      case "medium":
        return { fontSize: 11, fontWeight: "600" };
      case "large":
        return { fontSize: 12, fontWeight: "600" };
      default:
        return { fontSize: 11, fontWeight: "600" };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textSizeStyles = getTextSize();

  // Prepare display text
  const getDisplayText = () => {
    if (type === "dot") return "";
    if (type === "number") {
      if (count > maxCount) return `${maxCount}+`;
      return count.toString();
    }
    return text || "";
  };

  const containerStyles = [
    styles.badge,
    sizeStyles,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth || 0,
      borderColor: variantStyles.borderColor || "transparent",
    },
    type === "dot" && styles.dot,
    style,
  ];

  const textStyles = [
    styles.text,
    textSizeStyles,
    { color: variantStyles.textColor },
    textStyle,
  ];

  const displayText = getDisplayText();

  return (
    <View style={containerStyles}>
      {type !== "dot" && displayText && (
        <Text style={textStyles} numberOfLines={1}>
          {displayText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  dot: {
    borderRadius: 50, // Ensures perfect circle for dots
  },

  text: {
    ...TEXT_STYLES.caption,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default Badge;
