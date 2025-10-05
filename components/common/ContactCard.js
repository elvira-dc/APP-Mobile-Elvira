import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import AvatarButton from "./AvatarButton";
import AvatarModal from "./AvatarModal";

const ContactCard = ({
  item,
  onPress,
  onLongPress,
  onAvatarPress,
  variant = "contact", // "contact" or "conversation"
  showOnlineStatus = false,
  showUnreadIndicator = false,
  showActionIcon = false,
  actionIcon = "chatbubble-outline",
  isSelected = false,
  isGroupMode = false,
  style,
}) => {
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const isConversation = variant === "conversation";
  const isContact = variant === "contact";

  const handleAvatarPress = () => {
    if (onAvatarPress) {
      onAvatarPress(item);
    } else {
      setIsAvatarModalVisible(true);
    }
  };

  const renderAvatar = () => (
    <AvatarButton
      contact={item}
      onPress={handleAvatarPress}
      size={50}
      showOnlineStatus={showOnlineStatus}
      style={styles.avatarContainer}
    />
  );

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.primaryText}>
          {isConversation ? item.sender : item.name}
        </Text>
        <Text style={styles.timestamp}>
          {isConversation ? item.timestamp : null}
        </Text>
      </View>

      <Text
        style={[
          styles.secondaryText,
          isConversation && item.unread && styles.unreadText,
        ]}
        numberOfLines={2}
      >
        {isConversation
          ? item.lastMessage
          : `${item.position} • ${item.department}`}
      </Text>
    </View>
  );

  const renderRightElement = () => {
    if (isGroupMode) {
      return (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </View>
      );
    }

    if (isConversation && showUnreadIndicator && item.unread) {
      return <View style={styles.unreadIndicator} />;
    }

    if (isContact && showActionIcon) {
      return (
        <View style={styles.actionContainer}>
          <Ionicons name={actionIcon} size={20} color={COLORS.textSecondary} />
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          isSelected && styles.selectedContainer,
          style,
        ]}
        onPress={() => onPress?.(item)}
        onLongPress={() => onLongPress?.(item)}
        activeOpacity={0.7}
      >
        {renderAvatar()}
        {renderContent()}
        {renderRightElement()}
      </TouchableOpacity>

      <AvatarModal
        visible={isAvatarModalVisible}
        onClose={() => setIsAvatarModalVisible(false)}
        contact={item}
        onStartChat={onPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    ...SHADOWS.subtle,
  },

  avatarContainer: {
    marginRight: SPACING.md,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },

  primaryText: {
    ...TEXT_STYLES.bodyMedium,
    flex: 1,
  },

  timestamp: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },

  secondaryText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  unreadText: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textPrimary,
  },

  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },

  actionContainer: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },

  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  selectedContainer: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
});

export default ContactCard;
