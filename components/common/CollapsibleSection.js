import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const CollapsibleSection = ({
  title,
  children,
  initialCollapsed = false,
  style,
  titleStyle,
  contentStyle,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [animation] = useState(new Animated.Value(initialCollapsed ? 0 : 1));

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);

    Animated.timing(animation, {
      toValue: newCollapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleCollapse}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          contentStyle,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // Adjust max height as needed
            }),
            opacity: animation,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TEXT_STYLES.h3,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  content: {
    overflow: "hidden",
  },
});

export default CollapsibleSection;
