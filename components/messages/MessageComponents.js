import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

// Message Types
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  VOICE: "voice",
  FILE: "file",
};

// Base Message Bubble Component
export const MessageBubble = ({
  children,
  isMe,
  messageType = MESSAGE_TYPES.TEXT,
  timestamp,
  style,
  ...props
}) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.messageBubble,
        isMe ? styles.myBubble : styles.otherBubble,
        messageType === MESSAGE_TYPES.IMAGE && styles.imageBubble,
        messageType === MESSAGE_TYPES.VIDEO && styles.videoBubble,
        style,
      ]}
      {...props}
    >
      {children}
      <Text
        style={[
          styles.messageTime,
          isMe ? styles.myMessageTime : styles.otherMessageTime,
        ]}
      >
        {formatTime(timestamp)}
      </Text>
    </View>
  );
};

// Text Message Component
export const TextMessage = ({ text, isMe, timestamp, ...props }) => {
  return (
    <MessageBubble
      isMe={isMe}
      timestamp={timestamp}
      messageType={MESSAGE_TYPES.TEXT}
      {...props}
    >
      <Text
        style={[
          styles.messageText,
          isMe ? styles.myMessageText : styles.otherMessageText,
        ]}
      >
        {text}
      </Text>
    </MessageBubble>
  );
};

// Image Message Component
export const ImageMessage = ({
  imageUri,
  text,
  isMe,
  timestamp,
  onImagePress,
  ...props
}) => {
  return (
    <MessageBubble
      isMe={isMe}
      timestamp={timestamp}
      messageType={MESSAGE_TYPES.IMAGE}
      {...props}
    >
      <TouchableOpacity onPress={() => onImagePress?.(imageUri)}>
        <Image
          source={{ uri: imageUri }}
          style={styles.messageImage}
          resizeMode="cover"
        />
        {text ? (
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {text}
          </Text>
        ) : null}
      </TouchableOpacity>
    </MessageBubble>
  );
};

// Voice Message Component
export const VoiceMessage = ({
  duration,
  isMe,
  timestamp,
  onPlay,
  isPlaying = false,
  ...props
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <MessageBubble
      isMe={isMe}
      timestamp={timestamp}
      messageType={MESSAGE_TYPES.VOICE}
      {...props}
    >
      <View style={styles.voiceContainer}>
        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isMe ? COLORS.white : COLORS.primary },
          ]}
          onPress={onPlay}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={20}
            color={isMe ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>

        <View style={styles.voiceWaveform}>
          {[...Array(15)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: Math.random() * 20 + 8,
                  backgroundColor: isMe ? COLORS.white : COLORS.primary + "80",
                },
              ]}
            />
          ))}
        </View>

        <Text
          style={[
            styles.voiceDuration,
            { color: isMe ? COLORS.white : COLORS.textSecondary },
          ]}
        >
          {formatDuration(duration)}
        </Text>
      </View>
    </MessageBubble>
  );
};

// Video Message Component
export const VideoMessage = ({
  videoUri,
  text,
  isMe,
  timestamp,
  onVideoPress,
  thumbnailUri,
  duration,
  ...props
}) => {
  return (
    <MessageBubble
      isMe={isMe}
      timestamp={timestamp}
      messageType={MESSAGE_TYPES.VIDEO}
      {...props}
    >
      <TouchableOpacity onPress={() => onVideoPress?.(videoUri)}>
        <View style={styles.videoContainer}>
          {thumbnailUri ? (
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="videocam" size={40} color={COLORS.white} />
            </View>
          )}

          <View style={styles.videoOverlay}>
            <View style={styles.playIconContainer}>
              <Ionicons name="play-circle" size={50} color={COLORS.white} />
            </View>
            {duration && (
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>
                  {Math.floor(duration / 60)}:
                  {(duration % 60).toString().padStart(2, "0")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {text ? (
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {text}
          </Text>
        ) : null}
      </TouchableOpacity>
    </MessageBubble>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "80%",
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginVertical: SPACING.xs,
  },

  myBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
  },

  otherBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: "flex-start",
  },

  imageBubble: {
    padding: SPACING.xs,
  },

  videoBubble: {
    padding: SPACING.xs,
  },

  messageText: {
    ...TEXT_STYLES.body,
    lineHeight: 20,
  },

  myMessageText: {
    color: COLORS.white,
  },

  otherMessageText: {
    color: COLORS.textPrimary,
  },

  messageTime: {
    ...TEXT_STYLES.caption,
    marginTop: SPACING.xs,
  },

  myMessageTime: {
    color: COLORS.white + "80",
    textAlign: "right",
  },

  otherMessageTime: {
    color: COLORS.textSecondary,
    textAlign: "left",
  },

  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },

  voiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },

  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },

  voiceWaveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SPACING.sm,
    height: 30,
  },

  waveformBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },

  voiceDuration: {
    ...TEXT_STYLES.caption,
    marginLeft: SPACING.sm,
  },

  videoContainer: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    marginBottom: SPACING.xs,
    position: "relative",
  },

  videoThumbnail: {
    width: "100%",
    height: "100%",
  },

  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.textSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  playIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  videoDuration: {
    position: "absolute",
    bottom: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },

  videoDurationText: {
    ...TEXT_STYLES.caption,
    color: COLORS.white,
    fontSize: 12,
  },
});

export default {
  MessageBubble,
  TextMessage,
  ImageMessage,
  VoiceMessage,
  VideoMessage,
  MESSAGE_TYPES,
};
