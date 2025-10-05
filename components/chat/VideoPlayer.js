import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING } from "@styles/globalStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const VideoPlayer = ({
  visible = false,
  videoUri = null,
  onClose = () => {},
  onShare = null,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setIsPlaying(false);
      setIsLoading(true);
      setPosition(0);
      setShowControls(true);
    } else {
      // Pause video when modal closes
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
      setIsPlaying(false);
    }
  }, [visible]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlayback = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsBuffering(status.isBuffering || false);
    }
  };

  const onVideoLoad = (status) => {
    setIsLoading(false);
    setDuration(status.durationMillis || 0);
  };

  const onVideoError = (error) => {
    console.error("Video error:", error);
    setIsLoading(false);
  };

  const seekTo = async (percentage) => {
    if (!videoRef.current || !duration) return;

    try {
      const position = duration * (percentage / 100);
      await videoRef.current.setPositionAsync(position);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleScreenPress = () => {
    setShowControls(!showControls);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
    onClose();
  };

  if (!visible || !videoUri) {
    return null;
  }

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.videoContainer}
          activeOpacity={1}
          onPress={handleScreenPress}
        >
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="contain"
            shouldPlay={false}
            isLooping={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onLoad={onVideoLoad}
            onError={onVideoError}
          />

          {/* Loading Indicator */}
          {(isLoading || isBuffering) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.white} />
              <Text style={styles.loadingText}>
                {isLoading ? "Loading..." : "Buffering..."}
              </Text>
            </View>
          )}

          {/* Play/Pause Button Overlay */}
          {showControls && !isLoading && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayback}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={60}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Controls Overlay */}
        {showControls && (
          <>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={30} color={COLORS.white} />
              </TouchableOpacity>

              {onShare && (
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => onShare(videoUri)}
                >
                  <Ionicons name="share" size={24} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.progressThumb,
                      { left: `${Math.max(0, progressPercentage - 2)}%` },
                    ]}
                    onPress={(event) => {
                      const { locationX } = event.nativeEvent;
                      const containerWidth =
                        event.currentTarget.parent?.width || screenWidth - 100;
                      const percentage = (locationX / containerWidth) * 100;
                      seekTo(percentage);
                    }}
                  />
                </View>

                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...TEXT_STYLES.body,
    color: COLORS.white,
    marginTop: SPACING.sm,
  },
  playButton: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  topControls: {
    position: "absolute",
    top: StatusBar.currentHeight + SPACING.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: SPACING.lg + 30,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  timeText: {
    ...TEXT_STYLES.caption,
    color: COLORS.white,
    minWidth: 40,
    textAlign: "center",
  },
  progressBar: {
    flex: 1,
    height: 20,
    justifyContent: "center",
    marginHorizontal: SPACING.sm,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    top: -4,
  },
});

export default VideoPlayer;
