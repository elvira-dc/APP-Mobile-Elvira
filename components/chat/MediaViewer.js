import React from "react";
import { Alert } from "react-native";
import ImageViewer from "./ImageViewer";
import VideoPlayer from "./VideoPlayer";
import { MESSAGE_TYPES } from "@components/messages";

// Optional imports - will handle gracefully if not available
let Sharing, FileSystem, MediaLibrary;
try {
  Sharing = require("expo-sharing");
} catch (e) {
  console.warn("expo-sharing not available");
}
try {
  FileSystem = require("expo-file-system");
} catch (e) {
  console.warn("expo-file-system not available");
}
try {
  MediaLibrary = require("expo-media-library");
} catch (e) {
  console.warn("expo-media-library not available");
}

const MediaViewer = ({
  visible = false,
  mediaType = null,
  mediaUri = null,
  onClose = () => {},
}) => {
  // Handle sharing media
  const handleShare = async (uri) => {
    try {
      if (Sharing && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: getMediaMimeType(mediaType),
          dialogTitle: "Share media",
        });
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing functionality requires expo-sharing package"
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share media");
    }
  };

  // Handle saving media to device
  const handleSave = async (uri) => {
    try {
      if (!MediaLibrary || !FileSystem) {
        Alert.alert(
          "Save not available",
          "Save functionality requires expo-media-library and expo-file-system packages"
        );
        return;
      }

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Permission to access media library is required to save files"
        );
        return;
      }

      // Download file first if it's a remote URL
      let localUri = uri;
      if (uri.startsWith("http")) {
        const downloadResult = await FileSystem.downloadAsync(
          uri,
          FileSystem.documentDirectory + getFileName(uri, mediaType)
        );
        localUri = downloadResult.uri;
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(localUri);
      await MediaLibrary.createAlbumAsync("Elvira App", asset, false);

      Alert.alert("Success", "Media saved to gallery");
    } catch (error) {
      console.error("Error saving:", error);
      Alert.alert("Error", "Failed to save media");
    }
  };

  // Get appropriate MIME type
  const getMediaMimeType = (type) => {
    switch (type) {
      case MESSAGE_TYPES.IMAGE:
        return "image/jpeg";
      case MESSAGE_TYPES.VIDEO:
        return "video/mp4";
      default:
        return "application/octet-stream";
    }
  };

  // Generate filename based on media type
  const getFileName = (uri, type) => {
    const timestamp = Date.now();
    const extension = getFileExtension(type);
    return `elvira_media_${timestamp}.${extension}`;
  };

  // Get file extension based on media type
  const getFileExtension = (type) => {
    switch (type) {
      case MESSAGE_TYPES.IMAGE:
        return "jpg";
      case MESSAGE_TYPES.VIDEO:
        return "mp4";
      default:
        return "bin";
    }
  };

  // Render appropriate viewer based on media type
  if (mediaType === MESSAGE_TYPES.IMAGE) {
    return (
      <ImageViewer
        visible={visible}
        imageUri={mediaUri}
        onClose={onClose}
        onShare={handleShare}
        onSave={handleSave}
      />
    );
  }

  if (mediaType === MESSAGE_TYPES.VIDEO) {
    return (
      <VideoPlayer
        visible={visible}
        videoUri={mediaUri}
        onClose={onClose}
        onShare={handleShare}
      />
    );
  }

  // For other media types, show a generic handler or return null
  return null;
};

export default MediaViewer;
