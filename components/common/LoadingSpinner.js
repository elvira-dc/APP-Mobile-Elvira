import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING } from "@styles/globalStyles";

const LoadingSpinner = ({
  size = "medium", // "small", "medium", "large", "xlarge"
  color,
  variant = "primary", // "primary", "secondary", "inverse", "custom"
  text,
  textPosition = "bottom", // "bottom", "right", "none"
  centered = false,
  overlay = false,
  overlayColor = "rgba(0, 0, 0, 0.3)",
  style,
  textStyle,
  containerStyle,
  ...props
}) => {
  // Get size configurations
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          spinnerSize: "small",
          numericSize: 16,
          spacing: SPACING.xs,
          textSize: 12,
        };
      case "large":
        return {
          spinnerSize: "large",
          numericSize: 36,
          spacing: SPACING.sm,
          textSize: 16,
        };
      case "xlarge":
        return {
          spinnerSize: "large", // ActivityIndicator only supports small/large
          numericSize: 48,
          spacing: SPACING.md,
          textSize: 18,
        };
      default: // medium
        return {
          spinnerSize: "small", // Default to small for better consistency
          numericSize: 24,
          spacing: SPACING.sm,
          textSize: 14,
        };
    }
  };

  // Get color based on variant
  const getColor = () => {
    if (color) return color;

    switch (variant) {
      case "secondary":
        return COLORS.textSecondary;
      case "inverse":
        return COLORS.textInverse;
      case "custom":
        return color || COLORS.primary;
      default: // primary
        return COLORS.primary;
    }
  };

  const sizeConfig = getSizeConfig();
  const spinnerColor = getColor();

  const renderSpinner = () => (
    <ActivityIndicator
      size={sizeConfig.spinnerSize}
      color={spinnerColor}
      style={style}
      {...props}
    />
  );

  const renderText = () => {
    if (!text || textPosition === "none") return null;

    return (
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeConfig.textSize,
            color: spinnerColor,
            marginTop: textPosition === "bottom" ? sizeConfig.spacing : 0,
            marginLeft: textPosition === "right" ? sizeConfig.spacing : 0,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    );
  };

  const renderContent = () => {
    const contentDirection = textPosition === "right" ? "row" : "column";
    const contentAlignment = textPosition === "right" ? "center" : "center";

    return (
      <View
        style={[
          styles.content,
          {
            flexDirection: contentDirection,
            alignItems: contentAlignment,
          },
          centered && styles.centered,
          containerStyle,
        ]}
      >
        {renderSpinner()}
        {renderText()}
      </View>
    );
  };

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        {renderContent()}
      </View>
    );
  }

  return renderContent();
};

// Predefined loading configurations for common use cases
LoadingSpinner.Button = (props) => (
  <LoadingSpinner
    size="small"
    variant="inverse"
    textPosition="none"
    {...props}
  />
);

LoadingSpinner.Screen = (props) => (
  <LoadingSpinner
    size="large"
    centered={true}
    text="Loading..."
    textPosition="bottom"
    {...props}
  />
);

LoadingSpinner.Overlay = (props) => (
  <LoadingSpinner
    size="large"
    overlay={true}
    centered={true}
    text="Loading..."
    textPosition="bottom"
    variant="inverse"
    {...props}
  />
);

LoadingSpinner.Inline = (props) => (
  <LoadingSpinner size="small" textPosition="right" {...props} />
);

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  text: {
    ...TEXT_STYLES.caption,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoadingSpinner;
