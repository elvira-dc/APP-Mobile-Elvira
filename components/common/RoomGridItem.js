import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { StatusIndicator, Badge } from "@components/common";

const RoomGridItem = ({ room, onPress, onLongPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "clean":
        return COLORS.success;
      case "dirty":
        return COLORS.error;
      case "in-progress":
        return "#FFD700"; // Yellow color for pending
      case "maintenance":
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  const getMailIcon = (messageStatus) => {
    switch (messageStatus) {
      case "unread":
        return "mail-outline"; // Outline closed mail for unread
      case "read":
        return "mail-open-outline"; // Outline open mail for read
      case "none":
      default:
        return null; // No mail icon
    }
  };

  const getMailColor = (messageStatus) => {
    switch (messageStatus) {
      case "unread":
        return COLORS.error; // Red for unread
      case "read":
        return COLORS.gray600; // Gray for read
      default:
        return COLORS.gray600;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "clean":
        return "checkmark-circle"; // OK
      case "dirty":
        return "close-circle"; // NO
      case "in-progress":
        return "alert-circle"; // PENDING - Yellow circle
      case "maintenance":
        return "construct";
      default:
        return "alert-circle"; // Default to pending
    }
  };

  const getBedIcon = (roomType) => {
    switch (roomType?.toLowerCase()) {
      case "suite":
        return "bed"; // Larger bed icon for suites
      case "deluxe":
        return "bed";
      case "standard":
      default:
        return "bed-outline"; // Outline bed for standard rooms
    }
  };

  const getRoomTypeColor = (roomType) => {
    switch (roomType?.toLowerCase()) {
      case "suite":
        return COLORS.primary;
      case "deluxe":
        return COLORS.secondary;
      case "standard":
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => onPress?.(room)}
      onLongPress={() => onLongPress?.(room)}
      delayLongPress={500}
    >
      {/* Mail Icon - Top Left */}
      {getMailIcon(room.messageStatus) && (
        <View style={styles.mailIndicator}>
          <Ionicons
            name={getMailIcon(room.messageStatus)}
            size={16}
            color={getMailColor(room.messageStatus)}
          />
        </View>
      )}

      {/* Status Indicator - Top Right */}
      <View style={styles.statusIndicator}>
        <Ionicons
          name={getStatusIcon(room.status)}
          size={18}
          color={getStatusColor(room.status)}
        />
      </View>

      {/* Bed Icon */}
      <View style={styles.bedIconContainer}>
        <Ionicons
          name={getBedIcon(room.type)}
          size={32}
          color={COLORS.gray400} // Grey color for all bed icons
        />
      </View>

      {/* Room Number */}
      <Text style={styles.roomNumber}>{room.number}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1, // Makes it square
    minHeight: 80,
    maxHeight: 120,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    position: "relative",
  },

  mailIndicator: {
    position: "absolute",
    top: SPACING.xs,
    left: SPACING.xs,
    zIndex: 1,
  },

  statusIndicator: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    zIndex: 1,
  },

  bedIconContainer: {
    marginBottom: SPACING.sm,
  },

  roomNumber: {
    ...TEXT_STYLES.h4,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default RoomGridItem;
