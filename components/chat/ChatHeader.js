import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import AvatarButton from "@components/common/AvatarButton";

const ChatHeader = ({
  contact,
  onAvatarPress = () => {},
  onBackPress = () => {},
  onCallPress = () => {},
  onVideoCallPress = () => {},
  onMenuPress = () => {},
  showBackButton = true,
  showActionButtons = true,
}) => {
  // Generate header configuration for React Navigation
  const getHeaderOptions = () => ({
    headerShown: true,
    headerTitle: () => (
      <TouchableOpacity
        style={styles.headerTitle}
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        <AvatarButton
          contact={contact}
          size={40}
          showOnlineStatus={true}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactStatus}>
            {contact.department && `${contact.department} • `}
            {contact.isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    headerLeft: showBackButton
      ? () => (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )
      : null,
    headerRight: showActionButtons
      ? () => (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onCallPress}>
              <Ionicons name="call" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onVideoCallPress}
            >
              <Ionicons
                name="videocam"
                size={22}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onMenuPress}>
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )
      : null,
    headerStyle: {
      backgroundColor: COLORS.surface,
      elevation: 2,
      shadowOpacity: 0.1,
    },
  });

  return { getHeaderOptions };
};

// Hook version for easier use in components
export const useChatHeader = ({
  contact,
  navigation,
  onAvatarPress = () => {},
  onCallPress = () => {},
  onVideoCallPress = () => {},
  onMenuPress = () => {},
  onBackPress = null, // Custom back handler
  showBackButton = true,
  showActionButtons = true,
}) => {
  const headerOptions = React.useMemo(
    () => ({
      headerShown: true,
      headerTitle: () => (
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={onAvatarPress}
          activeOpacity={0.7}
        >
          <AvatarButton
            contact={contact}
            size={40}
            showOnlineStatus={true}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactStatus}>
              {contact.department && `${contact.department} • `}
              {contact.isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      headerLeft: showBackButton
        ? () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress || (() => navigation.goBack())}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )
        : null,
      headerRight: showActionButtons
        ? () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onCallPress}
              >
                <Ionicons name="call" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onVideoCallPress}
              >
                <Ionicons
                  name="videocam"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onMenuPress}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )
        : null,
      headerStyle: {
        backgroundColor: COLORS.surface,
        elevation: 2,
        shadowOpacity: 0.1,
      },
    }),
    [
      contact,
      navigation,
      onAvatarPress,
      onCallPress,
      onVideoCallPress,
      onMenuPress,
      showBackButton,
      showActionButtons,
    ]
  );

  // Set up the header when the hook is used
  React.useEffect(() => {
    navigation.setOptions(headerOptions);
  }, [navigation, headerOptions]);

  return headerOptions;
};

// Standalone header component for custom implementations
export const ChatHeaderComponent = ({
  contact,
  onAvatarPress = () => {},
  onBackPress = () => {},
  onCallPress = () => {},
  onVideoCallPress = () => {},
  onMenuPress = () => {},
  showBackButton = true,
  showActionButtons = true,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Section */}
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Center Section */}
      <TouchableOpacity
        style={styles.headerTitleContainer}
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        <AvatarButton
          contact={contact}
          size={40}
          showOnlineStatus={true}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactStatus}>
            {contact.department && `${contact.department} • `}
            {contact.isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Section */}
      {showActionButtons && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onCallPress}>
            <Ionicons name="call" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onVideoCallPress}
          >
            <Ionicons name="videocam" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onMenuPress}>
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    marginRight: SPACING.sm,
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textPrimary,
  },
  contactStatus: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.xs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
});

export default ChatHeader;
