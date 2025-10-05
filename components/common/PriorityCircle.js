import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";

const PriorityCircle = ({ priority, size = "medium" }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return COLORS.error; // Red
      case "medium":
        return COLORS.warning; // Yellow/Orange
      case "low":
        return COLORS.success; // Green
      default:
        return COLORS.gray400; // Gray for undefined
    }
  };

  const getCircleSize = (size) => {
    switch (size) {
      case "small":
        return 12;
      case "medium":
        return 16;
      case "large":
        return 20;
      default:
        return 16;
    }
  };

  const circleSize = getCircleSize(size);
  const backgroundColor = getPriorityColor(priority);

  return (
    <View
      style={[
        styles.circle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: backgroundColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    // Base circle styles - size and color will be applied dynamically
  },
});

export default PriorityCircle;
