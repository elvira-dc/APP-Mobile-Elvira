import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS, SHADOWS } from "@styles/globalStyles";
import { Input, Button } from "@components/common";

const TaskCreationModal = ({
  visible,
  onClose,
  onConfirm,
  assignedStaff = [], // Staff members to assign the task to
  initialTask = null, // Task data for editing mode
  isEditing = false, // Whether we're editing an existing task
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [priority, setPriority] = useState(initialTask?.priority || "medium");
  const [titleError, setTitleError] = useState("");

  // Reset fields when modal opens or initialTask changes
  useEffect(() => {
    if (visible) {
      setTitle(initialTask?.title || "");
      setDescription(initialTask?.description || "");
      setPriority(initialTask?.priority || "medium");
      setTitleError("");
    }
  }, [visible, initialTask]);

  // Debug logging
  console.log("🎯 TaskCreationModal render:", {
    visible,
    assignedStaff,
    hasOnClose: !!onClose,
    hasOnConfirm: !!onConfirm,
    platform: Platform.OS,
    title,
    description,
    priority,
  });

  const priorities = [
    { id: "low", label: "Low", color: COLORS.success },
    { id: "medium", label: "Medium", color: COLORS.warning },
    { id: "high", label: "High", color: COLORS.error },
  ];

  const handleConfirm = () => {
    console.log("✅ TaskCreationModal handleConfirm called", {
      isEditing,
      initialTask,
      title,
      description,
      priority,
      assignedStaff,
      assignedStaffNames: assignedStaff.map((staff) => staff.name),
    });

    // Validate required fields
    if (!title.trim()) {
      setTitleError("Title is required");
      console.log("❌ Validation failed: Title is required");
      return;
    }

    if (isEditing && initialTask) {
      // Update existing task
      const updatedTask = {
        ...initialTask,
        title: title.trim(),
        description: description.trim(),
        priority,
        assignee:
          assignedStaff.length > 0
            ? assignedStaff[0].name
            : initialTask.assignee,
        assignedTo:
          assignedStaff.length > 0
            ? assignedStaff.map((staff) => staff.name).join(", ")
            : initialTask.assignedTo,
      };

      console.log("📝 Updated task:", {
        taskId: updatedTask.id,
        assignee: updatedTask.assignee,
        assignedTo: updatedTask.assignedTo,
      });

      onConfirm(updatedTask);
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        priority,
        assignee: assignedStaff.length > 0 ? assignedStaff[0].name : "You", // Primary assignee
        assignedTo: assignedStaff.map((staff) => staff.name).join(", "), // All assigned staff
        status: "pending",
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        dueTime: "12:00 PM", // Default time
      };

      console.log("📝 Created task with assignment:", {
        taskId: newTask.id,
        assignee: newTask.assignee,
        assignedTo: newTask.assignedTo,
        assignedStaffCount: assignedStaff.length,
      });

      onConfirm(newTask);
    }

    handleClose();
  };

  const handleClose = () => {
    console.log("🚪 TaskCreationModal handleClose called");
    setTitle(initialTask?.title || "");
    setDescription(initialTask?.description || "");
    setPriority(initialTask?.priority || "medium");
    setTitleError("");
    onClose();
  };

  const handleOverlayPress = () => {
    console.log("🎯 Overlay pressed - closing modal");
    handleClose();
  };

  const handleTitleChange = (text) => {
    setTitle(text);
    if (titleError && text.trim()) {
      setTitleError("");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayBackground}
          activeOpacity={1}
          onPress={handleOverlayPress}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Content with KeyboardAvoidingView */}
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.content}>
                {/* Title Input */}
                <Input
                  label="Title"
                  placeholder="Enter task title"
                  value={title}
                  onChangeText={handleTitleChange}
                  error={titleError}
                  style={styles.input}
                />

                {/* Description Input */}
                <Input
                  label="Description"
                  placeholder="Enter task description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  style={[styles.input, styles.descriptionInput]}
                  inputStyle={styles.descriptionText}
                />

                {/* Priority Selection */}
                <View style={styles.prioritySection}>
                  <Text style={styles.priorityLabel}>
                    Priority <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.priorityButtons}>
                    {priorities.map((priorityOption) => (
                      <TouchableOpacity
                        key={priorityOption.id}
                        style={[
                          styles.priorityButton,
                          priority === priorityOption.id && [
                            styles.priorityButtonSelected,
                            { borderColor: priorityOption.color },
                          ],
                        ]}
                        onPress={() => setPriority(priorityOption.id)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.priorityDot,
                            { backgroundColor: priorityOption.color },
                            priority !== priorityOption.id &&
                              styles.priorityDotUnselected,
                          ]}
                        />
                        <Text
                          style={[
                            styles.priorityButtonText,
                            priority === priorityOption.id &&
                              styles.priorityButtonTextSelected,
                          ]}
                        >
                          {priorityOption.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Assigned Staff Info */}
                {assignedStaff && assignedStaff.length > 0 && (
                  <View style={styles.assignedSection}>
                    <Text style={styles.assignedLabel}>Assigned to:</Text>
                    <Text style={styles.assignedText}>
                      {assignedStaff.map((staff) => staff.name).join(", ")}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Cancel"
                    onPress={handleClose}
                    variant="ghost"
                    style={styles.cancelButton}
                  />
                  <Button
                    title={isEditing ? "Update" : "Create"}
                    onPress={handleConfirm}
                    style={styles.confirmButton}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    zIndex: 9999,
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF", // Temporarily using white to ensure visibility
    borderRadius: BORDER_RADIUS.lg,
    maxHeight: "90%",
    minHeight: 500,
    width: "100%",
    maxWidth: 420,
    ...SHADOWS.medium,
    elevation: 10, // Android shadow
    zIndex: 10000,
    overflow: "hidden",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TEXT_STYLES.h2,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SPACING.lg,
    minHeight: 400, // Ensure minimum content height
  },
  input: {
    marginBottom: SPACING.md,
  },
  descriptionInput: {
    minHeight: 80,
  },
  descriptionText: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  prioritySection: {
    marginBottom: SPACING.lg,
  },
  priorityLabel: {
    ...TEXT_STYLES.body,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.error,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: "transparent",
    gap: SPACING.xs,
  },
  priorityButtonSelected: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityDotUnselected: {
    opacity: 0.6,
  },
  priorityButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  priorityButtonTextSelected: {
    color: COLORS.text,
    fontWeight: "600",
  },
  assignedSection: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  assignedLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  assignedText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});

export default TaskCreationModal;
