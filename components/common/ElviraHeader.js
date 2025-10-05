import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, SHADOWS } from "@styles/globalStyles";

const ElviraHeader = ({
  title = "Elvira",
  showBackButton = false,
  leftButton = null,
  rightButton = null,
  onBackPress,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.container}>
        {/* Left Section - Back Button or Left Button */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
          ) : leftButton ? (
            leftButton
          ) : null}
        </View>

        {/* Center Section - Title (Left Aligned) */}
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightButton || <View style={styles.placeholder} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.subtle,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 70,
  },

  leftSection: {
    alignItems: "flex-start",
    marginRight: SPACING.md,
  },

  centerSection: {
    flex: 1,
    alignItems: "flex-start",
  },

  rightSection: {
    alignItems: "flex-end",
    marginLeft: SPACING.md,
  },

  title: {
    ...TEXT_STYLES.h1,
    textAlign: "left",
    fontWeight: "700",
  },

  iconButton: {
    padding: SPACING.sm,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  placeholder: {
    width: 44,
    height: 44,
  },
});

export default ElviraHeader;
