import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@constants/colors";
import { SPACING } from "@styles/globalStyles";

const AvatarButton = ({
  contact,
  onPress,
  size = 50,
  showOnlineStatus = false,
  style,
}) => {
  const avatarSize = size;
  const avatarRadius = size / 2;
  const fontSize = size * 0.4; // Proportional font size
  const onlineIndicatorSize = size * 0.24; // Proportional indicator size

  const handlePress = () => {
    if (onPress && contact) {
      onPress(contact);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarRadius,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarRadius,
          },
        ]}
      >
        <Text style={[styles.avatarText, { fontSize }]}>
          {contact?.avatar || "👤"}
        </Text>
        {showOnlineStatus && contact?.isOnline && (
          <View
            style={[
              styles.onlineIndicator,
              {
                width: onlineIndicatorSize,
                height: onlineIndicatorSize,
                borderRadius: onlineIndicatorSize / 2,
                bottom: size * 0.04,
                right: size * 0.04,
                borderWidth: size * 0.04,
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  avatar: {
    backgroundColor: COLORS.gray200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  avatarText: {
    color: COLORS.textPrimary,
  },

  onlineIndicator: {
    position: "absolute",
    backgroundColor: COLORS.success,
    borderColor: COLORS.surface,
  },
});

export default AvatarButton;
