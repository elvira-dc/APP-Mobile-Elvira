import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";

const { height: screenHeight } = Dimensions.get("window");

const ModalWrapper = ({
  visible = false,
  onClose,
  title,
  subtitle,
  variant = "default", // "default", "fullscreen", "bottom-sheet", "center"
  showHeader = true,
  showCloseButton = true,
  closeOnOverlay = true,
  animationType = "slide", // "slide", "fade", "none"
  keyboardAvoidingEnabled = true,
  scrollable = false,
  maxHeight,
  style,
  overlayStyle,
  contentStyle,
  headerStyle,
  children,
  headerLeft,
  headerRight,
  onModalShow,
  onModalHide,
  ...props
}) => {
  const handleOverlayPress = () => {
    if (closeOnOverlay && onClose) {
      onClose();
    }
  };

  const handleBackdropPress = (event) => {
    // Only close if the backdrop itself was pressed, not the modal content
    if (event.target === event.currentTarget) {
      handleOverlayPress();
    }
  };

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case "fullscreen":
        return {
          container: styles.fullscreenContainer,
          content: styles.fullscreenContent,
          animationType: "slide",
        };
      case "bottom-sheet":
        return {
          container: styles.bottomSheetContainer,
          content: styles.bottomSheetContent,
          animationType: "slide",
        };
      case "center":
        return {
          container: styles.centerContainer,
          content: styles.centerContent,
          animationType: "fade",
        };
      default:
        return {
          container: styles.defaultContainer,
          content: styles.defaultContent,
          animationType: "slide",
        };
    }
  };

  const variantStyles = getVariantStyles();
  const finalAnimationType = animationType || variantStyles.animationType;

  const renderHeader = () => {
    if (!showHeader && !title && !headerLeft && !headerRight) return null;

    return (
      <View style={[styles.header, headerStyle]}>
        {/* Left side */}
        <View style={styles.headerLeft}>{headerLeft}</View>

        {/* Center - Title */}
        <View style={styles.headerCenter}>
          {title && (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side */}
        <View style={styles.headerRight}>
          {headerRight}
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    const content = (
      <View
        style={[
          variantStyles.content,
          maxHeight && { maxHeight },
          contentStyle,
        ]}
      >
        {renderHeader()}

        {scrollable ? (
          <ScrollView
            style={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </View>
    );

    if (keyboardAvoidingEnabled) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoiding}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={finalAnimationType}
      onRequestClose={onClose}
      onShow={onModalShow}
      onDismiss={onModalHide}
      statusBarTranslucent={variant === "fullscreen"}
      {...props}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          variant === "fullscreen" && styles.fullscreenSafeArea,
        ]}
      >
        <TouchableOpacity
          style={[variantStyles.container, overlayStyle, style]}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          {renderContent()}
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

// Predefined modal configurations
ModalWrapper.BottomSheet = (props) => (
  <ModalWrapper variant="bottom-sheet" animationType="slide" {...props} />
);

ModalWrapper.Dialog = (props) => (
  <ModalWrapper
    variant="center"
    animationType="fade"
    closeOnOverlay={false}
    {...props}
  />
);

ModalWrapper.Fullscreen = (props) => (
  <ModalWrapper variant="fullscreen" animationType="slide" {...props} />
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  fullscreenSafeArea: {
    backgroundColor: COLORS.surface,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  // Container variants
  defaultContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  bottomSheetContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  // Content variants
  defaultContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: screenHeight * 0.9,
    ...SHADOWS.large,
  },

  fullscreenContent: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  bottomSheetContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: screenHeight * 0.8,
    ...SHADOWS.large,
  },

  centerContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    width: "100%",
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    ...SHADOWS.large,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    minHeight: 56,
  },

  headerLeft: {
    minWidth: 40,
    alignItems: "flex-start",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerRight: {
    minWidth: 40,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  headerTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  headerSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },

  closeButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

  // Content areas
  content: {
    flex: 1,
  },

  scrollableContent: {
    flex: 1,
  },
});

export default ModalWrapper;
