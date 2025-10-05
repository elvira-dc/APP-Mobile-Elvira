import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";

const EVENT_TYPES = [
  {
    id: "meeting",
    title: "Meeting",
    icon: "people-outline",
    color: COLORS.primary,
  },
  {
    id: "reminder",
    title: "Reminder",
    icon: "alarm-outline",
    color: COLORS.warning,
  },
  {
    id: "appointment",
    title: "Appointment",
    icon: "calendar-outline",
    color: COLORS.success,
  },
  {
    id: "deadline",
    title: "Deadline",
    icon: "flag-outline",
    color: COLORS.error,
  },
  {
    id: "personal",
    title: "Personal",
    icon: "person-outline",
    color: COLORS.info,
  },
  {
    id: "other",
    title: "Other",
    icon: "ellipsis-horizontal-outline",
    color: COLORS.textSecondary,
  },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const EventCreationModal = ({
  visible = false,
  onClose,
  onConfirm,
  selectedDate,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleConfirm = () => {
    if (!selectedType || !title.trim()) return;

    onConfirm?.({
      type: selectedType,
      title: title.trim(),
      notes: notes.trim(),
      time: selectedTime,
      date: selectedDate,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedType(null);
    setTitle("");
    setNotes("");
    setSelectedTime("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year:
        selectedDate.getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  const isFormValid = selectedType && title.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Event</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Date Display */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate()}</Text>
            </View>

            {/* Event Type Section */}
            <Text style={styles.sectionLabel}>Event Type</Text>
            <View style={styles.typeGrid}>
              {EVENT_TYPES.map((type) => {
                const isSelected = selectedType?.id === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      isSelected && [
                        styles.typeButtonSelected,
                        { backgroundColor: type.color },
                      ],
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

            {/* Title Section */}
            <Text style={styles.sectionLabel}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter event title"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={100}
            />

            {/* Time Section */}
            <Text style={styles.sectionLabel}>Time (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.timeScrollContainer}
            >
              <View style={styles.timeContainer}>
                {TIME_SLOTS.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeButton,
                      selectedTime === time && styles.timeButtonSelected,
                    ]}
                    onPress={() =>
                      setSelectedTime(selectedTime === time ? "" : time)
                    }
                  >
                    <Text
                      style={[
                        styles.timeButtonText,
                        selectedTime === time && styles.timeButtonTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Notes Section */}
            <Text style={styles.sectionLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional details..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={500}
            />

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  !isFormValid && styles.createButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!isFormValid}
              >
                <Text
                  style={[
                    styles.createButtonText,
                    !isFormValid && styles.createButtonTextDisabled,
                  ]}
                >
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: "85%",
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
    marginTop: SPACING.sm,
    fontSize: 16,
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },

  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
    gap: SPACING.xs,
    minWidth: "48%",
    justifyContent: "center",
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  typeButtonSelected: {
    borderColor: "transparent",
  },

  typeButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },

  typeButtonTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },

  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...TEXT_STYLES.body,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },

  timeScrollContainer: {
    marginBottom: SPACING.md,
  },

  timeContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },

  timeButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
    minWidth: 60,
    alignItems: "center",
  },

  timeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  timeButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },

  timeButtonTextSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },

  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 80,
    maxHeight: 120,
    ...TEXT_STYLES.body,
    color: COLORS.text,
    backgroundColor: COLORS.white,
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

  createButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },

  createButtonDisabled: {
    backgroundColor: COLORS.gray200,
  },

  createButtonText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.white,
  },

  createButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
});

export default EventCreationModal;
