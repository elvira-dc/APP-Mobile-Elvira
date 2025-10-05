import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import AvatarButton from "@components/common/AvatarButton";
import AvatarModal from "@components/common/AvatarModal";
import {
  MessageContainer,
  useMessageGrouping,
  MESSAGE_TYPES,
} from "@components/messages";
import { ChatInput, MediaViewer, useChatHeader } from "@components/chat";
import { useChat } from "@hooks";

// Get device dimensions for media display
const { width: screenWidth } = Dimensions.get("window");

const ChatScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [message, setMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState({ uri: null, type: null });
  const [isMediaViewerVisible, setIsMediaViewerVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // Use chat hook for message management
  const {
    messages,
    isRecording,
    flatListRef,
    handleSendTextMessage,
    handleSendMediaMessage,
    startVoiceRecording,
    stopVoiceRecording,
  } = useChat({ contact });

  // Get source information from navigation params
  const sourceScreen = route.params?.sourceScreen;
  const sourceRoom = route.params?.sourceRoom;

  // Custom back navigation handler
  const handleBackPress = () => {
    if (sourceScreen === "RoomDetailModal" && sourceRoom) {
      // Navigate back to Rooms tab and re-open the room detail modal
      navigation.navigate("Rooms");
      // Note: The RoomDetailModal would need to be re-opened via the RoomsScreen
      // For now, just navigate back to Rooms tab
    } else {
      // Default back navigation
      navigation.goBack();
    }
  };

  // Set up chat header using the hook
  useChatHeader({
    contact,
    navigation,
    onAvatarPress: () => setIsAvatarModalVisible(true),
    onCallPress: () => console.log("Call", contact.name),
    onVideoCallPress: () => console.log("Video call", contact.name),
    onMenuPress: () => console.log("Menu for", contact.name),
    onBackPress: handleBackPress, // Custom back handler
  });

  // Use message grouping to add date separators
  const groupedMessages = useMessageGrouping(messages);

  // Render message using the new MessageContainer component
  const renderMessage = ({ item }) => (
    <MessageContainer
      message={item}
      showDate={item.showDate}
      onImagePress={(imageUri) => {
        setSelectedMedia({ uri: imageUri, type: MESSAGE_TYPES.IMAGE });
        setIsMediaViewerVisible(true);
      }}
      onVideoPress={(videoUri) => {
        setSelectedMedia({ uri: videoUri, type: MESSAGE_TYPES.VIDEO });
        setIsMediaViewerVisible(true);
      }}
      onVoicePlay={(messageId) => {
        console.log("Play voice message:", messageId);
        // TODO: Implement voice playback
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <MediaViewer
          visible={isMediaViewerVisible}
          mediaType={selectedMedia.type}
          mediaUri={selectedMedia.uri}
          onClose={() => {
            setIsMediaViewerVisible(false);
            setSelectedMedia({ uri: null, type: null });
          }}
        />

        <ChatInput
          message={message}
          onMessageChange={setMessage}
          onSend={(messageText) => {
            handleSendTextMessage(messageText);
            setMessage(""); // Clear the input
          }}
          onSendMedia={handleSendMediaMessage}
          isRecording={isRecording}
          onStartRecording={startVoiceRecording}
          onStopRecording={stopVoiceRecording}
        />
      </KeyboardAvoidingView>

      {/* Avatar Modal */}
      <AvatarModal
        visible={isAvatarModalVisible}
        onClose={() => setIsAvatarModalVisible(false)}
        contact={contact}
        onCall={(contact) => console.log("Call", contact.name)}
        onInfo={(contact) => console.log("View info for", contact.name)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  messagesList: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  messagesContent: {
    paddingVertical: SPACING.lg,
  },
});

export default ChatScreen;
