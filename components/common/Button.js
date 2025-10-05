import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import LoadingSpinner from "./LoadingSpinner";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import { componentThemes } from "@constants/theme";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <LoadingSpinner.Button
          variant={
            variant === "primary" || variant === "danger"
              ? "inverse"
              : "primary"
          }
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    ...SHADOWS.small,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    marginRight: SPACING.xs,
  },

  // Variants using theme configuration
  primary: {
    backgroundColor: componentThemes.buttons.primary.backgroundColor,
    borderWidth: 0,
  },

  secondary: {
    backgroundColor: componentThemes.buttons.secondary.backgroundColor,
    borderWidth: 1,
    borderColor: componentThemes.buttons.secondary.borderColor,
  },

  outline: {
    backgroundColor: componentThemes.buttons.outline.backgroundColor,
    borderWidth: 1.5,
    borderColor: componentThemes.buttons.outline.borderColor,
  },

  ghost: {
    backgroundColor: componentThemes.buttons.ghost.backgroundColor,
    borderWidth: 0,
  },

  danger: {
    backgroundColor: componentThemes.buttons.danger.backgroundColor,
    borderWidth: 0,
  },

  // Sizes with modern spacing
  small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minHeight: 36,
  },

  medium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },

  large: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },

  // Text styles using typography system
  buttonText: {
    ...TEXT_STYLES.buttonMedium,
    textAlign: "center",
  },

  primaryText: {
    color: componentThemes.buttons.primary.textColor,
  },

  secondaryText: {
    color: componentThemes.buttons.secondary.textColor,
  },

  outlineText: {
    color: componentThemes.buttons.outline.textColor,
  },

  ghostText: {
    color: componentThemes.buttons.ghost.textColor,
  },

  dangerText: {
    color: componentThemes.buttons.danger.textColor,
  },

  // Size-specific text styles
  smallText: {
    ...TEXT_STYLES.buttonSmall,
  },

  mediumText: {
    ...TEXT_STYLES.buttonMedium,
  },

  largeText: {
    ...TEXT_STYLES.buttonLarge,
  },

  // States
  disabled: {
    opacity: 0.6,
    backgroundColor: COLORS.gray200,
  },

  disabledText: {
    color: COLORS.textDisabled,
  },
});

export default Button;
