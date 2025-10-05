import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const StatusIndicator = ({
  status = "pending",
  variant = "icon", // "icon", "dot", "badge", "text"
  size = "medium", // "small", "medium", "large"
  customIcon,
  customColor,
  showText = false,
  text,
  style,
  textStyle,
  iconStyle,
  ...props
}) => {
  // Status configurations
  const statusConfig = {
    // Task statuses
    pending: {
      icon: "ellipse-outline",
      color: COLORS.warning,
      text: "Pending",
    },
    "in-progress": {
      icon: "time",
      color: COLORS.info,
      text: "In Progress",
    },
    completed: {
      icon: "checkmark-circle",
      color: COLORS.success,
      text: "Completed",
    },
    cancelled: {
      icon: "close-circle",
      color: COLORS.error,
      text: "Cancelled",
    },

    // User statuses
    online: {
      icon: "radio-button-on",
      color: COLORS.success,
      text: "Online",
    },
    offline: {
      icon: "radio-button-off",
      color: COLORS.gray400,
      text: "Offline",
    },
    away: {
      icon: "time",
      color: COLORS.warning,
      text: "Away",
    },
    busy: {
      icon: "do-not-disturb",
      color: COLORS.error,
      text: "Busy",
    },

    // Room statuses
    clean: {
      icon: "checkmark-circle",
      color: COLORS.success,
      text: "Clean",
    },
    dirty: {
      icon: "close-circle",
      color: COLORS.error,
      text: "Needs Cleaning",
    },
    maintenance: {
      icon: "construct",
      color: COLORS.warning,
      text: "Maintenance",
    },
    occupied: {
      icon: "person",
      color: COLORS.info,
      text: "Occupied",
    },
    available: {
      icon: "checkmark",
      color: COLORS.success,
      text: "Available",
    },

    // Priority statuses
    high: {
      icon: "arrow-up",
      color: COLORS.error,
      text: "High Priority",
    },
    medium: {
      icon: "remove",
      color: COLORS.warning,
      text: "Medium Priority",
    },
    low: {
      icon: "arrow-down",
      color: COLORS.success,
      text: "Low Priority",
    },

    // General statuses
    active: {
      icon: "checkmark-circle",
      color: COLORS.success,
      text: "Active",
    },
    inactive: {
      icon: "pause-circle",
      color: COLORS.gray400,
      text: "Inactive",
    },
    warning: {
      icon: "warning",
      color: COLORS.warning,
      text: "Warning",
    },
    error: {
      icon: "alert-circle",
      color: COLORS.error,
      text: "Error",
    },
    info: {
      icon: "information-circle",
      color: COLORS.info,
      text: "Info",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const icon = customIcon || config.icon;
  const color = customColor || config.color;
  const displayText = text || config.text;

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          iconSize: 12,
          dotSize: 8,
          badgeMinWidth: 16,
          badgeHeight: 16,
          fontSize: 10,
          padding: SPACING.xs / 2,
        };
      case "large":
        return {
          iconSize: 24,
          dotSize: 16,
          badgeMinWidth: 32,
          badgeHeight: 24,
          fontSize: 14,
          padding: SPACING.sm,
        };
      default: // medium
        return {
          iconSize: 16,
          dotSize: 12,
          badgeMinWidth: 24,
          badgeHeight: 20,
          fontSize: 12,
          padding: SPACING.xs,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderIndicator = () => {
    switch (variant) {
      case "dot":
        return (
          <View
            style={[
              styles.dot,
              {
                width: sizeStyles.dotSize,
                height: sizeStyles.dotSize,
                backgroundColor: color,
                borderRadius: sizeStyles.dotSize / 2,
              },
              style,
            ]}
            {...props}
          />
        );

      case "badge":
        return (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: color,
                minWidth: sizeStyles.badgeMinWidth,
                height: sizeStyles.badgeHeight,
                paddingHorizontal: sizeStyles.padding,
                borderRadius: sizeStyles.badgeHeight / 2,
              },
              style,
            ]}
            {...props}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  fontSize: sizeStyles.fontSize,
                  color: COLORS.white,
                },
                textStyle,
              ]}
            >
              {displayText}
            </Text>
          </View>
        );

      case "text":
        return (
          <Text
            style={[
              styles.statusText,
              {
                color: color,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
              style,
            ]}
            {...props}
          >
            {displayText}
          </Text>
        );

      case "icon":
      default:
        return (
          <View style={[styles.iconContainer, style]} {...props}>
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={color}
              style={iconStyle}
            />
            {showText && (
              <Text
                style={[
                  styles.iconText,
                  {
                    fontSize: sizeStyles.fontSize,
                    color: color,
                    marginLeft: SPACING.xs,
                  },
                  textStyle,
                ]}
              >
                {displayText}
              </Text>
            )}
          </View>
        );
    }
  };

  return renderIndicator();
};

const styles = StyleSheet.create({
  dot: {
    alignSelf: "flex-start",
  },

  badge: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  badgeText: {
    ...TEXT_STYLES.caption,
    fontWeight: "600",
    textAlign: "center",
  },

  statusText: {
    ...TEXT_STYLES.caption,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  iconText: {
    ...TEXT_STYLES.caption,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

export default StatusIndicator;
