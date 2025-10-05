import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const FilterTabs = ({
  options = [],
  activeIndex = 0,
  onPress,
  variant = "default", // "default", "primary", "minimal"
  size = "medium", // "small", "medium", "large"
  scrollable = false,
  showCount = false,
  counts = [],
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  containerStyle,
  ...props
}) => {
  const [lastPressTime, setLastPressTime] = React.useState({});
  const scrollViewRef = React.useRef(null);

  // Debug logs for spacing and props
  React.useEffect(() => {
    console.log("FilterTabs Debug Info:", {
      scrollable,
      variant,
      size,
      optionsCount: options.length,
      activeIndex,
      containerStyle,
      style,
    });
  }, [scrollable, variant, size, options.length, activeIndex]);
  // Get variant styles
  const getVariantStyles = (isActive) => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: isActive ? COLORS.primary : COLORS.gray100,
          borderColor: isActive ? COLORS.primary : "transparent",
        };
      case "minimal":
        return {
          backgroundColor: "transparent",
          borderColor: isActive ? COLORS.primary : "transparent",
          borderBottomWidth: 2,
        };
      default:
        return {
          backgroundColor: isActive ? COLORS.primary : COLORS.gray100,
          borderColor: "transparent",
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          minHeight: 32,
        };
      case "large":
        return {
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          minHeight: 48,
        };
      default: // medium
        return {
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          minHeight: 40,
        };
    }
  };

  // Get text color based on variant and active state
  const getTextColor = (isActive) => {
    if (variant === "minimal") {
      return isActive ? COLORS.primary : COLORS.textSecondary;
    }
    return isActive ? COLORS.textInverse : COLORS.textSecondary;
  };

  const renderTab = (option, index) => {
    const isActive = index === activeIndex;
    const variantStyles = getVariantStyles(isActive);
    const sizeStyles = getSizeStyles();

    const tabStyles = [
      styles.tab,
      sizeStyles,
      variantStyles,
      variant === "minimal" && styles.minimalTab,
      tabStyle,
      isActive && activeTabStyle,
    ];

    const textColor = getTextColor(isActive);
    const tabTextStyles = [
      styles.tabText,
      { color: textColor },
      textStyle,
      isActive && activeTextStyle,
    ];

    const handlePress = () => {
      // Trigger haptic feedback on button press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const now = Date.now();
      const lastPress = lastPressTime[index] || 0;
      const timeDiff = now - lastPress;

      console.log("FilterTabs Press Debug:", {
        index,
        option,
        isActive,
        now,
        lastPress,
        timeDiff,
        isDoubleClick: timeDiff < 500 && isActive,
      });

      // Check for double-click on active filter (simpler, faster detection)
      if (timeDiff < 500 && isActive) {
        console.log(
          "🔄 DOUBLE-CLICK SUCCESS! Resetting to All filter (index 0)"
        );
        console.log('💡 TIP: Double-click any active filter to reset to "All"');

        // Enhanced haptic feedback for reset
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Reset to first option (All)
        onPress?.(0, options[0]);
        setLastPressTime({ ...lastPressTime, [index]: 0 }); // Reset timing
        return;
      }

      // Single click - normal behavior
      console.log(`👆 Single click on tab ${index}: ${option}`);
      setLastPressTime({ ...lastPressTime, [index]: now });
      onPress?.(index, option);

      // Center the selected tab if scrollable
      if (scrollable && scrollViewRef.current) {
        console.log("📱 Scrolling to center tab:", index);
        setTimeout(() => {
          const tabWidth = size === "large" ? 120 : size === "small" ? 80 : 100;
          const spacing = SPACING.xs;
          const totalTabWidth = tabWidth + spacing;
          const scrollOffset = index * totalTabWidth - totalTabWidth / 2;

          scrollViewRef.current?.scrollTo({
            x: Math.max(0, scrollOffset),
            animated: true,
          });
        }, 50);
      }
    };

    return (
      <TouchableOpacity
        key={index}
        style={tabStyles}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Text style={tabTextStyles} numberOfLines={1}>
            {option}
          </Text>
          {showCount && counts[index] !== undefined && (
            <View
              style={[styles.countBadge, isActive && styles.activeCountBadge]}
            >
              <Text
                style={[styles.countText, isActive && styles.activeCountText]}
              >
                {counts[index]}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const containerStyles = [styles.container, containerStyle, style];

  // Debug logging for styles (reduced)
  console.log("FilterTabs:", {
    scrollable,
    variant,
    size,
    optionsCount: options.length,
  });

  if (scrollable) {
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollContainer}
        {...props}
      >
        {options.map(renderTab)}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyles} {...props}>
      {options.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: SPACING.sm,
  },

  scrollContentContainer: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.xs,
    alignItems: "center",
    flexDirection: "row",
  },

  container: {
    flexDirection: "row",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
    justifyContent: "center",
    alignItems: "center",
  },

  tab: {
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  minimalTab: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
  },

  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  tabText: {
    ...TEXT_STYLES.caption,
    fontWeight: "500",
    textAlign: "center",
  },

  countBadge: {
    backgroundColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xs,
  },

  activeCountBadge: {
    backgroundColor: COLORS.white + "30", // 30% opacity white
  },

  countText: {
    ...TEXT_STYLES.caption,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  activeCountText: {
    color: COLORS.white,
  },
});

export default FilterTabs;
