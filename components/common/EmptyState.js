import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import Button from "./Button";

const EmptyState = ({
  icon = "document-outline",
  iconSize = 64,
  iconColor = COLORS.textTertiary,
  title = "No items found",
  description,
  actionText,
  onAction,
  variant = "default", // "default", "search", "error", "illustration"
  centered = true,
  style,
  iconStyle,
  titleStyle,
  descriptionStyle,
  children,
  ...props
}) => {
  // Predefined configurations for common scenarios
  const getPresetConfig = () => {
    switch (variant) {
      case "search":
        return {
          icon: "search-outline",
          title: "No results found",
          description: "Try adjusting your search terms or filters",
          iconColor: COLORS.textTertiary,
        };
      case "error":
        return {
          icon: "alert-circle-outline",
          title: "Something went wrong",
          description: "Unable to load data. Please try again.",
          iconColor: COLORS.error,
          actionText: "Retry",
        };
      case "illustration":
        return {
          icon: "image-outline",
          title: "Welcome!",
          description: "Get started by adding your first item",
          iconColor: COLORS.primary,
        };
      default:
        return {};
    }
  };

  const presetConfig = getPresetConfig();
  const finalIcon = icon || presetConfig.icon || "document-outline";
  const finalTitle = title || presetConfig.title;
  const finalDescription = description || presetConfig.description;
  const finalIconColor =
    iconColor || presetConfig.iconColor || COLORS.textTertiary;
  const finalActionText = actionText || presetConfig.actionText;

  const containerStyles = [
    styles.container,
    centered && styles.centered,
    style,
  ];

  return (
    <View style={containerStyles} {...props}>
      {/* Icon */}
      <View style={[styles.iconContainer, iconStyle]}>
        <Ionicons name={finalIcon} size={iconSize} color={finalIconColor} />
      </View>

      {/* Title */}
      <Text style={[styles.title, titleStyle]}>{finalTitle}</Text>

      {/* Description */}
      {finalDescription && (
        <Text style={[styles.description, descriptionStyle]}>
          {finalDescription}
        </Text>
      )}

      {/* Custom content */}
      {children}

      {/* Action Button */}
      {finalActionText && onAction && (
        <Button
          title={finalActionText}
          onPress={onAction}
          variant="primary"
          size="medium"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

// Predefined empty state components for common scenarios
EmptyState.NoTasks = (props) => (
  <EmptyState
    icon="checkbox-outline"
    title="No tasks yet"
    description="Create your first task to get started"
    actionText="Add Task"
    {...props}
  />
);

EmptyState.NoMessages = (props) => (
  <EmptyState
    icon="chatbubbles-outline"
    title="No conversations"
    description="Start a conversation to begin chatting"
    actionText="New Chat"
    {...props}
  />
);

EmptyState.NoSearchResults = (props) => (
  <EmptyState variant="search" {...props} />
);

EmptyState.ConnectionError = (props) => (
  <EmptyState
    variant="error"
    icon="wifi-outline"
    title="Connection error"
    description="Check your internet connection and try again"
    actionText="Retry"
    {...props}
  />
);

EmptyState.NoNotifications = (props) => (
  <EmptyState
    icon="notifications-outline"
    title="All caught up!"
    description="No new notifications at this time"
    {...props}
  />
);

EmptyState.NoRooms = (props) => (
  <EmptyState
    icon="home-outline"
    title="No rooms available"
    description="Room information will appear here when available"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    alignItems: "center",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
  },

  iconContainer: {
    marginBottom: SPACING.lg,
  },

  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  description: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: SPACING.lg,
  },

  actionButton: {
    marginTop: SPACING.md,
    minWidth: 120,
  },
});

export default EmptyState;
