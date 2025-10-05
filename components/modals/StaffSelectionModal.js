import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { MOCK_STAFF } from "@constants/mockData";
import { SearchBox } from "@components/common";

const StaffSelectionModal = ({
  visible = false,
  onClose,
  title = "Select Staff Members",
  onConfirm,
  multiselect = true,
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchText, setSearchText] = useState("");



  // Test data to ensure we have something to display
  const testStaff = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Mike Rodriguez" },
    { id: 3, name: "Lisa Chen" },
    { id: 4, name: "Carlos Martinez" },
  ];

  // Use test data if MOCK_STAFF is not available
  const baseStaffData =
    MOCK_STAFF && MOCK_STAFF.length > 0 ? MOCK_STAFF : testStaff;

  // Filter staff based on search text
  const staffData = baseStaffData.filter((staff) =>
    staff.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleStaff = (staffId) => {
    setSelectedIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(staffId)) {
        newIds.delete(staffId);
      } else {
        if (!multiselect) {
          newIds.clear();
        }
        newIds.add(staffId);
      }
      return newIds;
    });
  };

  const handleConfirm = () => {
    const selectedStaff = baseStaffData.filter((staff) =>
      selectedIds.has(staff.id)
    );
    onConfirm?.(selectedStaff);
    onClose();
  };

  const renderStaffItem = ({ item }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        style={styles.staffItem}
        onPress={() => toggleStaff(item.id)}
      >
        {/* Checkbox */}
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </View>

        {/* Staff Name */}
        <Text style={styles.staffName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <SearchBox
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search staff members..."
              style={styles.searchBox}
            />
          </View>

          {/* Staff List */}
          <View style={styles.content}>
            <View style={styles.listContainer}>
              {staffData && staffData.length > 0 ? (
                <FlatList
                  data={staffData}
                  renderItem={renderStaffItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.list}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchText
                      ? `No staff found for "${searchText}"`
                      : "No staff members available"}
                  </Text>
                  {searchText && (
                    <Text style={styles.searchHint}>
                      Try a different search term
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                selectedIds.size === 0 && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={selectedIds.size === 0}
            >
              <Text
                style={[
                  styles.confirmText,
                  selectedIds.size === 0 && styles.confirmTextDisabled,
                ]}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: "90%",
    height: "70%",
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },

  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },

  searchBox: {
    marginBottom: 0,
  },

  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.text,
    flex: 1,
  },

  closeButton: {
    padding: SPACING.xs,
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },

  listContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  searchHint: {
    ...TEXT_STYLES.caption,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: SPACING.xs,
  },

  list: {
    flex: 1,
    backgroundColor: "transparent",
  },

  staffItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    marginRight: SPACING.md,
  },

  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  staffName: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    flex: 1,
  },

  actions: {
    flexDirection: "row",
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    gap: SPACING.md,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
  },

  cancelText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textSecondary,
  },

  confirmButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  confirmButtonDisabled: {
    backgroundColor: COLORS.gray200,
  },

  confirmText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.white,
  },

  confirmTextDisabled: {
    color: COLORS.textSecondary,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },

  emptyText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },

  debugText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
});

export default StaffSelectionModal;
