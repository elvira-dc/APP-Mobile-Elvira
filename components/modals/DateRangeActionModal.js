import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { ModalWrapper } from "@components/common";

const DateRangeActionModal = ({
  visible = false,
  onClose,
  dateRange,
  selectedStaff = [],
  onCreateShift,
  onRequestAbsence,
}) => {
  const formatDateRange = () => {
    if (!dateRange?.start) return "";

    const startDate = dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        dateRange.start.getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
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
      year:
        dateRange.end.getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });

    return `${startDate} - ${endDate}`;
  };

  const handleCreateShift = () => {
    onCreateShift?.(dateRange, selectedStaff);
    onClose();
  };

  const handleRequestAbsence = () => {
    onRequestAbsence?.(dateRange, selectedStaff);
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
            <Text style={styles.title}>Select Action</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Date Range */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDateRange()}</Text>
            {selectedStaff.length > 0 && (
              <Text style={styles.staffText}>
                For: {selectedStaff.map((staff) => staff.name).join(", ")}
              </Text>
            )}
          </View>

          {/* Action Type Label */}
          <Text style={styles.sectionLabel}>Action Type</Text>

          {/* Action Buttons Grid */}
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCreateShift}
            >
              <Ionicons name="calendar" size={16} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Create Shift</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRequestAbsence}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.warning} />
              <Text style={styles.actionButtonText}>Absence</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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

  staffText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  sectionLabel: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontSize: 16,
  },

  actionGrid: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    gap: SPACING.xs,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  actionButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },

  cancelButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
  },

  cancelButtonText: {
    ...TEXT_STYLES.bodyBold,
    color: COLORS.textSecondary,
  },
});

export default DateRangeActionModal;
