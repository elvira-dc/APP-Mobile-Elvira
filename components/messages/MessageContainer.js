import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import {
  TextMessage,
  ImageMessage,
  VoiceMessage,
  VideoMessage,
  MESSAGE_TYPES,
} from "./MessageComponents";

// Message Container with date separator and proper spacing
export const MessageContainer = ({
  message,
  showDate = false,
  onImagePress,
  onVideoPress,
  onVoicePlay,
  isVoicePlaying = false,
  ...props
}) => {
  const isMe = message.sender === "me";

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const isToday = messageDate.toDateString() === today.toDateString();

    if (isToday) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case MESSAGE_TYPES.IMAGE:
        return (
          <ImageMessage
            imageUri={message.mediaUri}
            text={message.text}
            isMe={isMe}
            timestamp={message.timestamp}
            onImagePress={onImagePress}
          />
        );

      case MESSAGE_TYPES.VIDEO:
        return (
          <VideoMessage
            videoUri={message.mediaUri}
            text={message.text}
            isMe={isMe}
            timestamp={message.timestamp}
            onVideoPress={onVideoPress}
            thumbnailUri={message.thumbnailUri}
            duration={message.duration}
          />
        );

      case MESSAGE_TYPES.VOICE:
        return (
          <VoiceMessage
            duration={message.duration}
            isMe={isMe}
            timestamp={message.timestamp}
            onPlay={() => onVoicePlay?.(message.id)}
            isPlaying={isVoicePlaying}
          />
        );

      case MESSAGE_TYPES.TEXT:
      default:
        return (
          <TextMessage
            text={message.text}
            isMe={isMe}
            timestamp={message.timestamp}
          />
        );
    }
  };

  return (
    <View {...props}>
      {showDate && (
        <View style={styles.dateContainer}>
          <View style={styles.dateBubble}>
            <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {/* Sender name for group chats (if not me) */}
        {!isMe && message.senderName && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        {renderMessageContent()}
      </View>
    </View>
  );
};

// Helper hook for message date grouping
export const useMessageGrouping = (messages) => {
  return React.useMemo(() => {
    if (!messages || messages.length === 0) return [];

    return messages.map((message, index) => {
      const currentDate = new Date(message.timestamp).toDateString();
      const previousDate =
        index > 0
          ? new Date(messages[index - 1].timestamp).toDateString()
          : null;

      return {
        ...message,
        showDate: currentDate !== previousDate,
      };
    });
  }, [messages]);
};

const styles = StyleSheet.create({
  messageContainer: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },

  myMessage: {
    alignItems: "flex-end",
  },

  otherMessage: {
    alignItems: "flex-start",
  },

  senderName: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  dateContainer: {
    alignItems: "center",
    marginVertical: SPACING.md,
  },

  dateBubble: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },

  dateText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});

export default MessageContainer;
