import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MESSAGE_TYPES } from "@components/messages";

export const useChat = ({ contact, initialMessages = [] }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef(null);

  // Mock messages for demonstration with multimedia content
  const mockMessages = useMemo(
    () => [
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
    ],
    [contact.name]
  );

  // Initialize messages
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else {
      setMessages(mockMessages);
    }
  }, [initialMessages]);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Send text message
  const handleSendTextMessage = useCallback(
    (messageText) => {
      if (!messageText || messageText.trim().length === 0) return;

      setMessages((prevMessages) => {
        const newMessage = {
          id: prevMessages.length + 1,
          text: messageText.trim(),
          type: MESSAGE_TYPES.TEXT,
          sender: "me",
          timestamp: new Date(),
          senderName: "You",
        };
        return [...prevMessages, newMessage];
      });
      simulateResponse();
    },
    [simulateResponse]
  );

  // Send media message (image, video, voice, etc.)
  const handleSendMediaMessage = useCallback(
    (type, mediaUri, text = "", duration = null) => {
      setMessages((prevMessages) => {
        const newMessage = {
          id: prevMessages.length + 1,
          text: text,
          type: type,
          mediaUri: mediaUri,
          duration: duration,
          sender: "me",
          timestamp: new Date(),
          senderName: "You",
        };
        return [...prevMessages, newMessage];
      });
    },
    []
  );

  // Simulate auto-response from contact
  const simulateResponse = useCallback(() => {
    setTimeout(() => {
      const responses = [
        "Thanks for the update!",
        "Got it, will handle that.",
        "Perfect, appreciate it! 👍",
        "Understood, thanks!",
        "Will take care of it right away.",
      ];

      setMessages((prevMessages) => {
        const responseMessage = {
          id: prevMessages.length + 2, // +2 because we just added a message
          text: responses[Math.floor(Math.random() * responses.length)],
          type: MESSAGE_TYPES.TEXT,
          sender: "other",
          timestamp: new Date(),
          senderName: contact.name,
        };
        return [...prevMessages, responseMessage];
      });
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  }, [contact.name]);

  // Voice recording handlers
  const startVoiceRecording = useCallback(() => {
    setIsRecording(true);
    console.log("Started voice recording...");

    // Simulate recording for demo
    setTimeout(() => {
      stopVoiceRecording();
    }, 3000);
  }, []);

  const stopVoiceRecording = useCallback(() => {
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
  }, [handleSendMediaMessage]);

  // Add a message (for external use)
  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Get message count
  const messageCount = messages.length;

  // Get latest message
  const latestMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  // Mark messages as read (placeholder for real implementation)
  const markAsRead = () => {
    console.log("Messages marked as read");
    // In real app, would update message read status
  };

  return {
    // State
    messages,
    isRecording,
    messageCount,
    latestMessage,

    // Refs
    flatListRef,

    // Actions
    handleSendTextMessage,
    handleSendMediaMessage,
    startVoiceRecording,
    stopVoiceRecording,
    addMessage,
    clearMessages,
    markAsRead,
    scrollToBottom,

    // Internal functions (exposed for customization)
    simulateResponse,
    setMessages,
  };
};

export default useChat;
