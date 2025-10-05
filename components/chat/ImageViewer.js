import React, { useState } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING } from "@styles/globalStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ImageViewer = ({
  visible = false,
  imageUri = null,
  onClose = () => {},
  onShare = null,
  onSave = null,
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Get image dimensions when loaded
  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    setImageSize({ width, height });
  };

  if (!visible || !imageUri) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={30} color={COLORS.white} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {onShare && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onShare(imageUri)}
            >
              <Ionicons name="share" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {onSave && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onSave(imageUri)}
            >
              <Ionicons name="download" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable/Zoomable Image Container */}
        <ScrollView
          style={styles.imageContainer}
          contentContainerStyle={styles.imageContentContainer}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLoad={onImageLoad}
          />
        </ScrollView>

        {/* Image Info */}
        {imageSize.width > 0 && (
          <View style={styles.imageInfo}>
            <Text style={styles.imageInfoText}>
              {imageSize.width} × {imageSize.height}
            </Text>
          </View>
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
  closeButton: {
    position: "absolute",
    top: StatusBar.currentHeight + SPACING.lg,
    right: SPACING.lg,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    position: "absolute",
    top: StatusBar.currentHeight + SPACING.lg,
    left: SPACING.lg,
    zIndex: 10,
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  imageContainer: {
    flex: 1,
  },
  imageContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: screenHeight,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  imageInfo: {
    position: "absolute",
    bottom: SPACING.lg + 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  imageInfoText: {
    color: COLORS.white,
    fontSize: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
});

export default ImageViewer;
