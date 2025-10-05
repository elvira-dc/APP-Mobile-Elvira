import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import {
  globalStyles,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "@styles/globalStyles";
import {
  SearchBox,
  ContactCard,
  LoadingSpinner,
  EmptyState,
} from "@components/common";
import { NewChatModal } from "@components/modals";
import { MOCK_MESSAGES } from "@constants/mockData";

// Global reference to the current MessagesScreen instance
let currentMessagesScreenRef = null;

// Export the reference getter for navigation to use
export const getMessagesScreenRef = () => currentMessagesScreenRef;

const MessagesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isNewChatModalVisible, setIsNewChatModalVisible] = useState(false);

  // Filter messages based on search text
  const messages = useMemo(() => {
    if (!searchText.trim()) return MOCK_MESSAGES;

    const query = searchText.toLowerCase();
    return MOCK_MESSAGES.filter(
      (msg) =>
        msg.sender.toLowerCase().includes(query) ||
        msg.lastMessage.toLowerCase().includes(query)
    );
  }, [searchText]);

  // Function to handle opening new chat modal
  const handleOpenNewChat = () => {
    console.log("handleOpenNewChat called");
    setIsNewChatModalVisible(true);
  };

  // Function to handle contact selection from modal
  const handleSelectContact = (contact) => {
    console.log("Starting new chat with:", contact.name);
    // Navigate to the ChatScreen with the selected contact
    navigation.navigate("Chat", { contact });
  };

  // Function to handle group chat creation
  const handleCreateGroupChat = (selectedContacts) => {
    console.log(
      "Creating group chat with:",
      selectedContacts.map((c) => c.name)
    );

    // Create a group contact object
    const groupContact = {
      id: `group_${Date.now()}`,
      name: `Group with ${selectedContacts
        .map((c) => c.name.split(" ")[0])
        .join(", ")}`,
      isGroup: true,
      members: selectedContacts,
      avatar: null, // Groups might use a different avatar approach
    };

    // Navigate to the ChatScreen with the group contact
    navigation.navigate("Chat", { contact: groupContact });
  };

  // Function to handle message item selection
  const handleSelectMessage = (message) => {
    console.log("Opening chat with:", message.sender);
    // Navigate to the ChatScreen with the message sender
    navigation.navigate("Chat", {
      contact: {
        name: message.sender,
        avatar: message.avatar,
        isOnline: true,
      },
    });
  };

  // Set up the global reference when component mounts
  React.useEffect(() => {
    currentMessagesScreenRef = {
      openNewChat: handleOpenNewChat,
    };

    // Also set it on the MessagesScreen function for backward compatibility
    MessagesScreen.openNewChat = handleOpenNewChat;
    console.log("MessagesScreen function reference updated");

    return () => {
      currentMessagesScreenRef = null;
      MessagesScreen.openNewChat = null;
    };
  }, []);

  // Update the function reference when it changes
  React.useEffect(() => {
    if (currentMessagesScreenRef) {
      currentMessagesScreenRef.openNewChat = handleOpenNewChat;
    }
    MessagesScreen.openNewChat = handleOpenNewChat;
  }, [handleOpenNewChat]);

  const renderMessageItem = ({ item }) => (
    <ContactCard
      item={item}
      variant="conversation"
      showUnreadIndicator={true}
      onPress={handleSelectMessage}
    />
  );

  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Search Section */}
        {console.log("💬 MessagesScreen SearchBox render:", {
          noCustomContainerStyle: "Using default SearchBox styles only",
        })}
        <SearchBox
          placeholder="Search messages..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Messages List */}
        <View style={styles.messagesSection}>
          {messages.length === 0 && (
            <EmptyState
              icon="chatbubble-outline"
              title={searchText ? "No Messages Found" : "No Messages"}
              description={
                searchText
                  ? `No conversations match "${searchText}"`
                  : "Start a conversation by tapping the + button"
              }
              actionText={searchText ? "Clear Search" : "Start New Chat"}
              onActionPress={
                searchText ? () => setSearchText("") : handleOpenNewChat
              }
            />
          )}

          {messages.length > 0 && (
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.messagesList}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </KeyboardAvoidingView>

      {/* New Chat Modal */}
      <NewChatModal
        visible={isNewChatModalVisible}
        onClose={() => setIsNewChatModalVisible(false)}
        onSelectContact={handleSelectContact}
        onCreateGroupChat={handleCreateGroupChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  messagesSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },

  messagesList: {
    flex: 1,
    paddingBottom: SPACING.xl,
  },
});

export default MessagesScreen;
