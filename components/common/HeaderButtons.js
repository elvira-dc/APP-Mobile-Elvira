import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { SPACING } from "@styles/globalStyles";
import Badge from "./Badge";

// Menu Button (hamburger menu)
export const MenuButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="menu" size={24} color={color} />
  </TouchableOpacity>
);

// Notification Button
export const NotificationButton = ({
  onPress,
  color = COLORS.white,
  hasNotifications = false,
  notificationCount = 0,
}) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <View style={styles.iconContainer}>
      <Ionicons
        name={hasNotifications ? "notifications" : "notifications-outline"}
        size={24}
        color={color}
      />
      {hasNotifications && (
        <Badge
          type={notificationCount > 0 ? "number" : "dot"}
          count={notificationCount}
          variant="error"
          size="small"
          style={styles.notificationBadge}
        />
      )}
    </View>
  </TouchableOpacity>
);

// Search Button
export const SearchButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="search" size={24} color={color} />
  </TouchableOpacity>
);

// Settings Button
export const SettingsButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="settings-outline" size={24} color={color} />
  </TouchableOpacity>
);

// Add Button (plus)
export const AddButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="add" size={24} color={color} />
  </TouchableOpacity>
);

// More Options Button (three dots)
export const MoreButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="ellipsis-vertical" size={24} color={color} />
  </TouchableOpacity>
);

// People Button
export const PeopleButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="people-outline" size={24} color={color} />
  </TouchableOpacity>
);

// Eye Button
export const EyeButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="eye-outline" size={24} color={color} />
  </TouchableOpacity>
);

// Sort Button
export const SortButton = ({ onPress, color = COLORS.white }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="swap-vertical-outline" size={24} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: SPACING.xs,
    borderRadius: 20,
    position: "relative",
  },

  iconContainer: {
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
  },
});
