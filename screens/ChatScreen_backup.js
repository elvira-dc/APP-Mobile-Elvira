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
import { ChatInput } from "@components/chat";

// Get device dimensions for media display
const { width: screenWidth } = Dimensions.get("window");

const ChatScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const recordingRef = useRef(null);

  // Mock messages for demonstration with multimedia content
  const mockMessages = [
    {
      id: 1,
      text: "Hey! How are things going in your department today?",
      type: MESSAGE_TYPES.TEXT,
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      senderName: contact.name,
    },
    {
      id: 2,
      text: "Pretty busy! We have several checkouts this morning. How about you?",
      type: MESSAGE_TYPES.TEXT,
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      senderName: "You",
    },
    {
      id: 3,
      text: "Here's a photo of the room condition",
      type: MESSAGE_TYPES.IMAGE,
      mediaUri:
        "https://via.placeholder.com/300x200/FF5A5F/FFFFFF?text=Room+205",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 22), // 22 minutes ago
      senderName: contact.name,
    },
    {
      id: 4,
      text: "", // Voice message has no text
      type: MESSAGE_TYPES.VOICE,
      duration: 12, // seconds
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
      senderName: "You",
    },
    {
      id: 5,
      text: "Got it! I'll send someone up there right away. Thanks for letting me know 👍",
      type: MESSAGE_TYPES.TEXT,
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      senderName: "You",
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    // Set navigation header
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={() => setIsAvatarModalVisible(true)}
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
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.surface,
        elevation: 2,
        shadowOpacity: 0.1,
      },
    });
  }, [navigation, contact]);

  // Multimedia handler functions
  const handleSendTextMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: messages.length + 1,
      text: message.trim(),
      type: MESSAGE_TYPES.TEXT,
      sender: "me",
      timestamp: new Date(),
      senderName: "You",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    scrollToBottom();
    simulateResponse();
  };

  const handleSendMediaMessage = (
    type,
    mediaUri,
    text = "",
    duration = null
  ) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      type: type,
      mediaUri: mediaUri,
      duration: duration,
      sender: "me",
      timestamp: new Date(),
      senderName: "You",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const simulateResponse = () => {
    setTimeout(() => {
      const responses = [
        "Thanks for the update!",
        "Got it, will handle that.",
        "Perfect, appreciate it! 👍",
        "Understood, thanks!",
        "Will take care of it right away.",
      ];

      const responseMessage = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        type: MESSAGE_TYPES.TEXT,
        sender: "other",
        timestamp: new Date(),
        senderName: contact.name,
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      scrollToBottom();
    }, 1000 + Math.random() * 2000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    console.log("Started voice recording...");

    // Simulate recording for demo
    setTimeout(() => {
      stopVoiceRecording();
    }, 3000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    console.log("Stopped voice recording");

    // Simulate sending voice message
    const duration = Math.floor(Math.random() * 30) + 5; // 5-35 seconds
    handleSendMediaMessage(
      MESSAGE_TYPES.VOICE,
      "voice_message.m4a",
      "",
      duration
    );
  };

  // Use message grouping to add date separators
  const groupedMessages = useMessageGrouping(messages);

  // Render message using the new MessageContainer component
  const renderMessage = ({ item }) => (
    <MessageContainer
      message={item}
      showDate={item.showDate}
      onImagePress={(imageUri) => {
        setSelectedImage(imageUri);
        setIsImageViewerVisible(true);
      }}
      onVideoPress={(videoUri) => {
        console.log("Play video:", videoUri);
        // TODO: Implement video player
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

        {/* Image Viewer Modal */}
        <Modal
          visible={isImageViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsImageViewerVisible(false)}
        >
          <View style={styles.imageViewerContainer}>
            <TouchableOpacity
              style={styles.imageViewerClose}
              onPress={() => setIsImageViewerVisible(false)}
            >
              <Ionicons name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </Modal>

        <ChatInput
          message={message}
          onMessageChange={setMessage}
          onSend={handleSendTextMessage}
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

  headerTitle: {
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
    marginLeft: SPACING.xs,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },

  messagesList: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  messagesContent: {
    paddingVertical: SPACING.lg,
  },

  // Image viewer styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  imageViewerClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: SPACING.sm,
  },

  fullImage: {
    width: "90%",
    height: "80%",
  },
});

export default ChatScreen;
