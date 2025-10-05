import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";

const { width: screenWidth } = Dimensions.get("window");

const AvatarModal = ({
  visible,
  onClose,
  contact,
  onStartChat,
  onCall,
  onInfo,
}) => {
  if (!contact) return null;

  const handleStartChat = () => {
    onStartChat?.(contact);
    onClose();
  };

  const handleCall = () => {
    onCall?.(contact);
    onClose();
  };

  const handleViewInfo = () => {
    onInfo?.(contact);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>{contact.avatar}</Text>
              {contact.isOnline && <View style={styles.onlineIndicator} />}
            </View>

            <Text style={styles.contactName}>
              {contact.name || contact.sender}
            </Text>
            {(contact.position || contact.department) && (
              <Text style={styles.contactDetails}>
                {contact.position && contact.department
                  ? `${contact.position} • ${contact.department}`
                  : contact.position || contact.department}
              </Text>
            )}
            {contact.isOnline !== undefined && (
              <Text
                style={[
                  styles.statusText,
                  contact.isOnline && styles.onlineText,
                ]}
              >
                {contact.isOnline ? "Online" : "Offline"}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {onStartChat && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleStartChat}
              >
                <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
            )}

            {onCall && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCall}
              >
                <Ionicons name="call" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            )}

            {onInfo && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewInfo}
              >
                <Ionicons
                  name="information-circle"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.actionButtonText}>Info</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: screenWidth * 0.8,
    maxWidth: 320,
    alignItems: "center",
    ...SHADOWS.large,
  },

  closeButton: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
    zIndex: 1,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },

  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    position: "relative",
    ...SHADOWS.medium,
  },

  largeAvatarText: {
    fontSize: 48,
  },

  onlineIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.surface,
  },

  contactName: {
    ...TEXT_STYLES.heading2,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },

  contactDetails: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },

  statusText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  onlineText: {
    color: COLORS.success,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  actionButton: {
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray50,
    minWidth: 80,
  },

  actionButtonText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.primary,
    marginTop: SPACING.xs,
    fontWeight: "500",
  },
});

export default AvatarModal;
