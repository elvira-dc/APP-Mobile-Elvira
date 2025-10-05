import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import {
  SearchBox,
  ContactCard,
  LoadingSpinner,
  EmptyState,
} from "@components/common";
import { MOCK_STAFF } from "@constants/mockData";

const NewChatModal = ({
  visible,
  onClose,
  onSelectContact,
  onCreateGroupChat,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());

  // Filter staff contacts based on search text
  const contacts = useMemo(() => {
    if (!searchText.trim()) return MOCK_STAFF;

    const query = searchText.toLowerCase();
    return MOCK_STAFF.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.department.toLowerCase().includes(query) ||
        contact.position.toLowerCase().includes(query)
    );
  }, [searchText]);

  const handleSelectContact = (contact) => {
    if (isGroupMode) {
      toggleContactSelection(contact);
    } else {
      onSelectContact?.(contact);
      onClose();
    }
  };

  const handleLongPressContact = (contact) => {
    setIsGroupMode(true);
    setSelectedContacts(new Set([contact.id]));
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(contact.id)) {
        newSelected.delete(contact.id);
      } else {
        newSelected.add(contact.id);
      }
      // Exit group mode if no contacts selected
      if (newSelected.size === 0) {
        setIsGroupMode(false);
      }
      return newSelected;
    });
  };

  const handleCreateGroupChat = () => {
    const selectedContactsArray = contacts.filter((contact) =>
      selectedContacts.has(contact.id)
    );
    onCreateGroupChat?.(selectedContactsArray);
    setIsGroupMode(false);
    setSelectedContacts(new Set());
    onClose();
  };

  const handleCancelGroupMode = () => {
    setIsGroupMode(false);
    setSelectedContacts(new Set());
  };

  const renderContactItem = ({ item }) => {
    const isSelected = selectedContacts.has(item.id);

    return (
      <ContactCard
        item={item}
        variant="contact"
        showOnlineStatus={true}
        showActionIcon={!isGroupMode}
        onPress={handleSelectContact}
        onLongPress={handleLongPressContact}
        isSelected={isSelected}
        isGroupMode={isGroupMode}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={isGroupMode ? handleCancelGroupMode : onClose}
            >
              <Ionicons
                name={isGroupMode ? "chevron-back" : "close"}
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isGroupMode
                ? `Group Chat (${selectedContacts.size})`
                : "New Chat"}
            </Text>
            {isGroupMode && selectedContacts.size >= 2 ? (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateGroupChat}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>

          {/* Search Bar */}
          <SearchBox
            placeholder="Search contacts..."
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.searchBoxContainer}
          />

          {/* Contacts List */}
          <View style={styles.contactsSection}>
            <Text style={styles.sectionTitle}>
              {searchText ? "Search Results" : "All Contacts"}
              {contacts.length > 0 && ` (${contacts.length})`}
            </Text>

            {contacts.length === 0 && (
              <EmptyState
                icon="people-outline"
                title={searchText ? "No Contacts Found" : "No Contacts"}
                description={
                  searchText
                    ? `No staff members match "${searchText}"`
                    : "No staff contacts available"
                }
                actionText={searchText ? "Clear Search" : undefined}
                onActionPress={searchText ? () => setSearchText("") : undefined}
              />
            )}

            {contacts.length > 0 && (
              <FlatList
                data={contacts}
                renderItem={renderContactItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.contactsList}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  closeButton: {
    padding: SPACING.xs,
  },

  headerTitle: {
    ...TEXT_STYLES.h2,
  },

  placeholder: {
    width: 32,
  },

  createButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },

  createButtonText: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.white,
    fontWeight: "600",
  },

  searchBoxContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },

  contactsSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  sectionTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },

  contactsList: {
    flex: 1,
  },
});

export default NewChatModal;
