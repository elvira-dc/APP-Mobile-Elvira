import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const ABSENCE_TYPES = [
  {
    id: "vacation",
    title: "Vacation",
    icon: "sunny-outline",
    color: COLORS.primary,
  },
  {
    id: "sick",
    title: "Sick",
    icon: "medical-outline",
    color: COLORS.error,
  },
  {
    id: "personal",
    title: "Personal",
    icon: "person-outline",
    color: COLORS.warning,
  },
  {
    id: "training",
    title: "Training",
    icon: "school-outline",
    color: COLORS.success,
  },
  {
    id: "other",
    title: "Other",
    icon: "help-outline",
    color: COLORS.info,
  },
];

const AbsenceTypeModal = ({
  visible = false,
  onClose,
  onConfirm,
  dateRange,
  selectedStaff = [],
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (!selectedType) return;

    onConfirm?.({
      type: selectedType,
      notes: notes.trim(),
      dateRange,
      selectedStaff,
    });

    // Reset form
    setSelectedType(null);
    setNotes("");
    onClose();
  };

  const formatDateRange = () => {
    if (!dateRange?.start) return "";

    const startDate = dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (
      !dateRange.end ||
      dateRange.start.getTime() === dateRange.end.getTime()
    ) {
      return startDate;
    }

    const endDate = dateRange.end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${startDate} - ${endDate}`;
  };

  const renderAbsenceType = ({ item }) => {
    const isSelected = selectedType?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.typeItem,
          isSelected && styles.typeItemSelected,
          { borderLeftColor: item.color },
        ]}
        onPress={() => setSelectedType(item)}
      >
        <View style={styles.typeContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.color + "20" },
            ]}
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>

          <View style={styles.typeTextContainer}>
            <Text style={styles.typeTitle}>{item.title}</Text>
            <Text style={styles.typeDescription}>{item.description}</Text>
          </View>

          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </View>
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
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Request Absence</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Date Range */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDateRange()}</Text>
          </View>

          {/* Request Type Label */}
          <Text style={styles.sectionLabel}>Request Type</Text>

          {/* Request Type Buttons Grid */}
          <View style={styles.typeGrid}>
            {ABSENCE_TYPES.map((type) => {
              const isSelected = selectedType?.id === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    isSelected && styles.typeButtonSelected,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Ionicons
                    name={type.icon}
                    size={16}
                    color={isSelected ? COLORS.white : type.color}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      isSelected && styles.typeButtonTextSelected,
                    ]}
                  >
                    {type.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Notes Section */}
          <Text style={styles.notesLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder=""
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedType && styles.submitButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!selectedType}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !selectedType && styles.submitButtonTextDisabled,
                ]}
              >
                Submit Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    margin: SPACING.lg,
    maxWidth: 400,
    width: "90%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },

  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.text,
    fontWeight: "600",
    flex: 1,
  },

  closeButton: {
    padding: SPACING.xs,
  },

  dateContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },

  dateText: {
    ...TEXT_STYLES.h4,
    color: COLORS.primary,
    fontWeight: "600",
  },

  sectionLabel: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontSize: 16,
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },

  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    minWidth: "48%",
    justifyContent: "center",
    gap: SPACING.xs,
  },

  typeButtonSelected: {
    backgroundColor: COLORS.primary,
  },

  typeButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },

  typeButtonTextSelected: {
    color: COLORS.white,
  },

  notesLabel: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontSize: 16,
  },

  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 60,
    maxHeight: 100,
    ...TEXT_STYLES.body,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
  },

  cancelButtonText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textSecondary,
  },

  submitButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  submitButtonDisabled: {
    backgroundColor: COLORS.gray200,
  },

  submitButtonText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.white,
  },

  submitButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
});

export default AbsenceTypeModal;
