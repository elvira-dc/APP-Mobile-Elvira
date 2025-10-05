import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const CalendarItem = ({
  item,
  type, // "shift", "absence", "event"
  onPress,
  showStaff = true,
  showDate = false,
}) => {
  const getItemConfig = () => {
    switch (type) {
      case "shift":
        return {
          icon: "calendar",
          borderColor: COLORS.primary,
          title: `Shift`,
          subtitle: getShiftSubtitle(),
        };
      case "absence":
        return {
          icon: item.type?.icon || "time-outline",
          borderColor: item.type?.color || COLORS.warning,
          title: item.type?.title || "Absence",
          subtitle: getAbsenceSubtitle(),
        };
      case "event":
        return {
          icon: item.type?.icon || "calendar-outline",
          borderColor: item.type?.color || COLORS.success,
          title: item.title || "Event",
          subtitle: getEventSubtitle(),
        };
      default:
        return {
          icon: "help-outline",
          borderColor: COLORS.gray400,
          title: "Unknown",
          subtitle: "",
        };
    }
  };

  const getShiftSubtitle = () => {
    const parts = [];

    if (showDate && item.dateRange) {
      const startDate = item.dateRange.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (
        item.dateRange.end &&
        item.dateRange.start.getTime() !== item.dateRange.end.getTime()
      ) {
        const endDate = item.dateRange.end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        parts.push(`${startDate} - ${endDate}`);
      } else {
        parts.push(startDate);
      }
    }

    if (showStaff && item.staff?.length > 0) {
      const staffNames = item.staff.map((s) => s.name).join(", ");
      parts.push(staffNames);
    }

    return parts.join(" • ");
  };

  const getAbsenceSubtitle = () => {
    const parts = [];

    if (showDate && item.dateRange) {
      const startDate = item.dateRange.start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (
        item.dateRange.end &&
        item.dateRange.start.getTime() !== item.dateRange.end.getTime()
      ) {
        const endDate = item.dateRange.end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        parts.push(`${startDate} - ${endDate}`);
      } else {
        parts.push(startDate);
      }
    }

    if (showStaff && item.selectedStaff?.length > 0) {
      const staffNames = item.selectedStaff.map((s) => s.name).join(", ");
      parts.push(staffNames);
    }

    if (item.notes?.trim()) {
      parts.push(item.notes.trim());
    }

    return parts.join(" • ");
  };

  const getEventSubtitle = () => {
    const parts = [];

    if (showDate && item.date) {
      const eventDate = item.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      parts.push(eventDate);
    }

    if (item.time) {
      parts.push(item.time);
    }

    if (item.notes?.trim()) {
      parts.push(item.notes.trim());
    }

    return parts.join(" • ");
  };

  const config = getItemConfig();

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: config.borderColor }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={config.icon} size={16} color={config.borderColor} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{config.title}</Text>
        {config.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {config.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  content: {
    flex: 1,
  },

  title: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    fontSize: 15,
  },

  subtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default CalendarItem;
