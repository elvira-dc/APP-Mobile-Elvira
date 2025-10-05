import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import { Button } from "@components/common";

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Delete Task",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const [hasShownAlert, setHasShownAlert] = useState(false);

  // Debug logging
  console.log("🗑️ DeleteConfirmationModal render:", {
    visible,
    hasShownAlert,
    platform: Platform.OS,
    title,
    message,
    hasOnClose: !!onClose,
    hasOnConfirm: !!onConfirm,
  });

  const handleOverlayPress = () => {
    console.log("🎯 DeleteConfirmationModal overlay pressed");
    onClose();
  };

  const handleConfirm = () => {
    console.log("✅ DeleteConfirmationModal confirm button pressed");
    onConfirm();
    onClose();
  };

  // On iOS, prefer using native Alert for better UX
  useEffect(() => {
    console.log("📱 DeleteConfirmationModal useEffect triggered:", {
      platform: Platform.OS,
      visible,
      hasShownAlert,
      shouldShowAlert: Platform.OS === "ios" && visible && !hasShownAlert,
    });

    if (Platform.OS === "ios" && visible && !hasShownAlert) {
      console.log("🚨 Showing iOS Alert for delete confirmation");
      setHasShownAlert(true);

      // Add a small delay to ensure state is stable
      setTimeout(() => {
        Alert.alert(
          title,
          message,
          [
            {
              text: cancelText,
              style: "cancel",
              onPress: () => {
                console.log("❌ iOS Alert - Cancel pressed");
                setHasShownAlert(false);
                onClose();
              },
            },
            {
              text: confirmText,
              style: "destructive",
              onPress: () => {
                console.log("✅ iOS Alert - Delete confirmed");
                setHasShownAlert(false);
                onConfirm();
              },
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              console.log("🚪 iOS Alert - Dismissed");
              setHasShownAlert(false);
              onClose();
            },
          }
        );
      }, 100);
    } else if (!visible && hasShownAlert) {
      console.log("🔄 DeleteConfirmationModal - Resetting hasShownAlert");
      setHasShownAlert(false);
    }
  }, [visible, hasShownAlert]);

  // On iOS, don't render the custom modal
  if (Platform.OS === "ios") {
    console.log(
      "📱 DeleteConfirmationModal - Returning null for iOS (using native Alert)"
    );
    return null;
  }

  console.log(
    "🖼️ DeleteConfirmationModal - Rendering custom modal for Android/Web"
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayBackground}
          onPress={handleOverlayPress}
          activeOpacity={1}
        />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="warning-outline"
                  size={32}
                  color={COLORS.error}
                />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title={cancelText}
                onPress={() => {
                  console.log("❌ Custom modal - Cancel button pressed");
                  onClose();
                }}
                variant="ghost"
                style={styles.cancelButton}
              />
              <Button
                title={confirmText}
                onPress={() => {
                  console.log("✅ Custom modal - Delete button pressed");
                  handleConfirm();
                }}
                style={[styles.confirmButton, styles.deleteButton]}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.large,
  },

  modalContent: {
    padding: SPACING.xl,
  },

  header: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.error + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  message: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  cancelButton: {
    flex: 1,
  },

  confirmButton: {
    flex: 1,
  },

  deleteButton: {
    backgroundColor: COLORS.error,
  },
});

export default DeleteConfirmationModal;
