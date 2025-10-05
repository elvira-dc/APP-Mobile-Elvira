import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { MESSAGE_TYPES } from "@components/messages";

const ChatInput = ({
  message,
  onMessageChange,
  onSend,
  onSendMedia,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
    }
  };

  const handleCameraPress = () => {
    setShowMediaOptions(false);
    Alert.alert("Camera", "Camera functionality would be implemented here", [
      {
        text: "Take Photo",
        onPress: () => {
          const photoUri =
            "https://via.placeholder.com/300x200/FF5A5F/FFFFFF?text=New+Photo";
          onSendMedia(MESSAGE_TYPES.IMAGE, photoUri, "Photo from camera");
        },
      },
      {
        text: "Record Video",
        onPress: () => {
          const videoUri =
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
          onSendMedia(MESSAGE_TYPES.VIDEO, videoUri, "Video message");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleGalleryPress = () => {
    setShowMediaOptions(false);
    Alert.alert("Gallery", "Select from gallery", [
      {
        text: "Photo",
        onPress: () => {
          const photoUri =
            "https://via.placeholder.com/300x200/00A699/FFFFFF?text=Gallery+Photo";
          onSendMedia(MESSAGE_TYPES.IMAGE, photoUri, "Photo from gallery");
        },
      },
      {
        text: "Video",
        onPress: () => {
          const videoUri =
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
          onSendMedia(MESSAGE_TYPES.VIDEO, videoUri, "Video from gallery");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDocumentPress = () => {
    setShowMediaOptions(false);
    Alert.alert("Documents", "Document picker would be implemented here");
  };

  return (
    <>
      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setShowMediaOptions(true)}
          >
            <Ionicons name="add" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={onMessageChange}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={1000}
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={message.trim() ? handleSend : undefined}
          />

          {message.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCameraPress}
              >
                <Ionicons
                  name="camera"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isRecording && styles.recordingButton,
                ]}
                onPress={isRecording ? onStopRecording : onStartRecording}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={22}
                  color={isRecording ? COLORS.white : COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Media Options Modal */}
      <Modal
        visible={showMediaOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMediaOptions(false)}
        >
          <View style={styles.mediaOptionsContainer}>
            <TouchableOpacity
              style={styles.mediaOption}
              onPress={handleCameraPress}
            >
              <View
                style={[
                  styles.mediaOptionIcon,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Ionicons name="camera" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.mediaOptionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mediaOption}
              onPress={handleGalleryPress}
            >
              <View
                style={[
                  styles.mediaOptionIcon,
                  { backgroundColor: COLORS.secondary },
                ]}
              >
                <Ionicons name="images" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.mediaOptionText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mediaOption}
              onPress={handleDocumentPress}
            >
              <View
                style={[
                  styles.mediaOptionIcon,
                  { backgroundColor: COLORS.warning },
                ]}
              >
                <Ionicons name="document" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.mediaOptionText}>Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minHeight: 44,
    maxHeight: 120,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  textInput: {
    ...TEXT_STYLES.body,
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.xs,
  },
  recordingButton: {
    backgroundColor: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  mediaOptionsContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mediaOption: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  mediaOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  mediaOptionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default ChatInput;
