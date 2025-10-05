import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const RoomDetailModal = ({ visible, room, onClose }) => {
  if (!room) return null;

  const navigation = useNavigation();

  // Create guest contact object for chat
  const createGuestContact = () => {
    return {
      id: `guest_${room.number}`,
      name: room.guest || `Guest - Room ${room.number}`,
      department: "Guest",
      position: "Hotel Guest",
      avatar: null,
      isOnline: true, // Assume guests are online when they're in the room
      lastSeen: "now",
      roomNumber: room.number,
      isGuest: true,
    };
  };

  // Handle chat button press
  const handleChatPress = () => {
    const guestContact = createGuestContact();

    // Close this modal first
    onClose();

    // Navigate to chat screen with source information
    // Navigate to the Messages stack first, then to Chat
    navigation.navigate("Messages", {
      screen: "Chat",
      params: {
        contact: guestContact,
        sourceScreen: "RoomDetailModal",
        sourceRoom: room,
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.roomNumber}>Room {room.number}</Text>
          <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
            <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Empty content area for future features */}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },

  backButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
  },

  roomNumber: {
    ...TEXT_STYLES.h1,
    color: COLORS.textPrimary,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },

  headerSpacer: {
    width: 44, // Same width as backButton to center the title
  },

  chatButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    width: 44, // Same width as backButton to keep layout balanced
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoomDetailModal;
