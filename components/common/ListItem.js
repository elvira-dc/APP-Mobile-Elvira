import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";

const ListItem = ({
  title,
  subtitle,
  description,
  leftIcon,
  leftIconColor = COLORS.textSecondary,
  leftIconSize = 24,
  rightIcon = "chevron-forward",
  rightIconColor = COLORS.textTertiary,
  rightIconSize = 20,
  rightElement,
  leftElement,
  children,
  onPress,
  disabled = false,
  variant = "default", // "default", "card", "simple"
  showBorder = true,
  showRightIcon = true,
  style,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  activeOpacity = 0.7,
  ...props
}) => {
  // Determine if the item should be touchable
  const isTouchable = !disabled && onPress;

  const renderLeftElement = () => {
    if (leftElement) return leftElement;
    if (leftIcon) {
      return (
        <View style={styles.leftIconContainer}>
          <Ionicons name={leftIcon} size={leftIconSize} color={leftIconColor} />
        </View>
      );
    }
    return null;
  };

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.textContainer}>
        {title && (
          <Text
            style={[styles.title, disabled && styles.disabledText, titleStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {description && (
          <Text
            style={[styles.description, descriptionStyle]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
        {children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </View>
  );

  const renderRightElement = () => {
    if (rightElement) return rightElement;
    if (showRightIcon && !disabled) {
      return (
        <View style={styles.rightIconContainer}>
          <Ionicons
            name={rightIcon}
            size={rightIconSize}
            color={rightIconColor}
          />
        </View>
      );
    }
    return null;
  };

  const containerStyles = [
    styles.container,
    styles[`${variant}Container`],
    showBorder && styles.bordered,
    disabled && styles.disabled,
    style,
  ];

  const contentWrapperStyles = [
    styles.contentWrapper,
    variant === "card" && styles.cardContentWrapper,
  ];

  if (isTouchable) {
    return (
      <TouchableOpacity
        style={containerStyles}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={activeOpacity}
        {...props}
      >
        <View style={contentWrapperStyles}>
          {renderLeftElement()}
          {renderContent()}
          {renderRightElement()}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyles} {...props}>
      <View style={contentWrapperStyles}>
        {renderLeftElement()}
        {renderContent()}
        {renderRightElement()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginVertical: SPACING.xs,
  },

  defaultContainer: {
    // Default flat list item style
  },

  cardContainer: {
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOWS.small,
  },

  simpleContainer: {
    backgroundColor: "transparent",
    marginVertical: 0,
  },

  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },

  cardContentWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },

  bordered: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },

  disabled: {
    opacity: 0.5,
  },

  leftIconContainer: {
    marginRight: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textPrimary,
  },

  subtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  description: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },

  disabledText: {
    color: COLORS.textDisabled,
  },

  rightIconContainer: {
    marginLeft: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },

  childrenContainer: {
    marginTop: SPACING.sm,
  },
});

export default ListItem;
