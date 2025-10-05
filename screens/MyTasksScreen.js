import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
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
  Button,
  PriorityCircle,
  LoadingSpinner,
  EmptyState,
} from "@components/common";
import { useTasks } from "@hooks/useTasks";
import {
  StaffSelectionModal,
  TaskCreationModal,
  DeleteConfirmationModal,
} from "@components/modals";

const MyTasksScreen = ({ onFilteredCountChange }) => {
  const [searchText, setSearchText] = useState("");
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaffMembers, setSelectedStaffMembers] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc"); // desc = newest first, asc = oldest first
  const [showSortBadge, setShowSortBadge] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [lastTap, setLastTap] = useState(0);

  // Use the new hooks
  const {
    tasks,
    loading,
    error,
    markTaskComplete,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  // Debug logging for modal state changes
  useEffect(() => {
    console.log("🎭 MyTasksScreen modal states:", {
      showStaffModal,
      showTaskModal,
      selectedStaffCount: selectedStaffMembers.length,
    });
  }, [showStaffModal, showTaskModal, selectedStaffMembers.length]);

  // Expose functions for header button access
  useEffect(() => {
    MyTasksScreen.openStaffModal = () => {
      console.log("👥 MyTasksScreen.openStaffModal called");
      setShowStaffModal(true);
    };
    MyTasksScreen.openTaskModal = () => {
      console.log("📝 MyTasksScreen.openTaskModal called");
      setShowTaskModal(true);
    };
    MyTasksScreen.toggleSort = () => {
      const newDirection = sortDirection === "desc" ? "asc" : "desc";
      setSortDirection(newDirection);

      // Show the badge and hide it after 3 seconds
      setShowSortBadge(true);
      setTimeout(() => {
        setShowSortBadge(false);
      }, 3000);

      console.log(
        "Tasks sorted by date:",
        newDirection === "desc" ? "newest first" : "oldest first"
      );
    };
    console.log("MyTasksScreen functions exposed");
  }, [sortDirection]);

  // Filter tasks based on search text and selected staff members
  const filteredTasks = useMemo(() => {
    let filteredTasks = tasks;

    // Filter by selected staff members first
    if (selectedStaffMembers.length > 0) {
      const selectedStaffNames = selectedStaffMembers.map(
        (staff) => staff.name
      );
      filteredTasks = filteredTasks.filter(
        (task) =>
          selectedStaffNames.includes(task.assignee) ||
          selectedStaffNames.includes(task.assignedTo)
      );
    }

    // Then filter by search text if provided
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          (task.assignee && task.assignee.toLowerCase().includes(query))
      );
    }

    // Apply sorting by date with proper date handling
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (sortDirection === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    console.log("📊 FILTERED & SORTED RESULTS:", {
      searchText,
      selectedStaffCount: selectedStaffMembers.length,
      selectedStaffNames: selectedStaffMembers.map((s) => s.name),
      sortDirection,
      totalTasks: tasks.length,
      filteredTasksCount: sortedTasks.length,
      sortedTasks: sortedTasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        assignee: t.assignee,
        dueDate: t.dueDate,
      })),
    });

    return sortedTasks;
  }, [tasks, searchText, selectedStaffMembers, sortDirection]);

  // Update navigation header when filtered count changes
  React.useEffect(() => {
    if (onFilteredCountChange) {
      onFilteredCountChange(filteredTasks.length);
    }
  }, [filteredTasks.length, onFilteredCountChange]);

  const handleTaskCreate = async (taskData) => {
    console.log("🚀 handleTaskCreate called with:", taskData);
    try {
      await createTask(taskData);
      console.log("✅ Task created successfully:", taskData);
      setShowTaskModal(false);
    } catch (error) {
      console.error("❌ Failed to create task:", error);
    }
  };

  const handleTaskEdit = async (taskData) => {
    console.log("📝 handleTaskEdit called with:", taskData);
    try {
      await updateTask(taskData.id, taskData);
      console.log("✅ Task updated successfully:", taskData);
      setShowEditModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("❌ Failed to update task:", error);
    }
  };

  const handleTaskDelete = async () => {
    console.log("🗑️ handleTaskDelete START:", {
      hasSelectedTask: !!selectedTask,
      selectedTaskId: selectedTask?.id,
      selectedTaskTitle: selectedTask?.title,
      showDeleteModal,
    });

    if (!selectedTask) {
      console.log("⚠️ handleTaskDelete - No selected task, aborting");
      setShowDeleteModal(false);
      return;
    }

    // Store task info before deletion
    const taskToDelete = { ...selectedTask };

    console.log("🗑️ handleTaskDelete - Proceeding with deletion:", {
      taskId: taskToDelete.id,
      taskTitle: taskToDelete.title,
    });

    try {
      // Clear state first to prevent multiple calls
      setShowDeleteModal(false);
      setSelectedTask(null);

      await deleteTask(taskToDelete.id);
      console.log("✅ Task deleted successfully:", {
        taskId: taskToDelete.id,
        taskTitle: taskToDelete.title,
      });
    } catch (error) {
      console.error("❌ Failed to delete task:", {
        taskId: taskToDelete?.id,
        error,
      });
      // Reset state on error
      setShowDeleteModal(false);
      setSelectedTask(null);
    }
  };

  const handleDoubleTap = (task) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Double tap detected - open edit modal
      console.log("👆👆 Double tap detected on task:", task.title);
      setSelectedTask(task);
      setShowEditModal(true);
      setLastTap(0); // Reset to prevent triple tap
    } else {
      setLastTap(now);
      // Single tap - just log for now
      console.log("👆 Single tap on task:", task.title);
    }
  };

  const handleLongPress = (task) => {
    console.log("🔒 Long press detected:", {
      taskId: task.id,
      taskTitle: task.title,
      currentSelectedTask: selectedTask?.id,
      currentShowDeleteModal: showDeleteModal,
    });

    setSelectedTask(task);
    console.log("🎯 Setting selectedTask to:", {
      id: task.id,
      title: task.title,
    });

    setShowDeleteModal(true);
    console.log("🗑️ Setting showDeleteModal to true");
  };

  const renderTaskFooter = (item) => {
    console.log("🦶 RENDER TASK FOOTER:", {
      taskId: item.id,
      dueDate: item.dueDate,
      assignee: item.assignee,
      status: item.status,
    });

    // Format date from dueDate instead of dueTime
    const formatDate = (dateString) => {
      if (!dateString) return "No date";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <View style={styles.taskFooter}>
        <View style={styles.taskDate}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.dateText}>{formatDate(item.dueDate)}</Text>
        </View>

        <Text style={styles.assigneeText}>{item.assignee}</Text>
      </View>
    );
  };

  const renderTaskItem = ({ item }) => {
    console.log("🔍 RENDER TASK ITEM:", {
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      assignee: item.assignee,
      dueTime: item.dueTime,
      isCompleted: item.status === "completed",
      willShowCompletedStyles: item.status === "completed",
      titleExists: !!item.title,
      descriptionExists: !!item.description,
    });

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          item.status === "completed" && styles.completedTaskCard,
        ]}
        onPress={() => handleDoubleTap(item)}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}
        delayLongPress={600}
      >
        <View style={styles.taskContent}>
          <View style={styles.taskInfo}>
            {/* Title row with priority and checkbox aligned */}
            <View style={styles.titleRow}>
              <PriorityCircle priority={item.priority} size="small" />
              <Text
                style={[
                  styles.taskTitle,
                  item.status === "completed" && styles.completedTaskTitle,
                ]}
              >
                {item.title}
              </Text>
              <View style={styles.titleRightSection}>
                {item.status !== "completed" && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteTask(item.id)}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color={COLORS.success}
                    />
                  </TouchableOpacity>
                )}
                {item.status === "completed" && (
                  <View style={styles.completedIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.success}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            <Text
              style={[
                styles.taskDescription,
                item.status === "completed" && styles.completedTaskDescription,
              ]}
            >
              {item.description}
            </Text>

            {/* Footer with date and staff */}
            {renderTaskFooter(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCompleteTask = async (taskId) => {
    console.log("🎯 COMPLETING TASK - Before:", {
      taskId,
      currentTasks: tasks.length,
      taskToComplete: tasks.find((t) => t.id === taskId),
    });

    try {
      await markTaskComplete(taskId);
      console.log("✅ Task marked as complete:", taskId);

      console.log("🎯 COMPLETING TASK - After:", {
        taskId,
        updatedTasks: tasks.length,
        completedTask: tasks.find((t) => t.id === taskId),
        allTasksWithStatus: tasks.map((t) => ({
          id: t.id,
          status: t.status,
          title: t.title,
        })),
      });
    } catch (error) {
      console.error("❌ Failed to complete task:", error);
    }
  };

  // Log main render information
  console.log("🏠 MYTASKS RENDER:", {
    totalTasks: tasks.length,
    filteredTasksCount: filteredTasks.length,
    searchText,
    isSearchActive: !!searchText.trim(),
    taskCardStyles: styles.taskCard,
    spacingValues: {
      xs: SPACING.xs,
      sm: SPACING.sm,
      md: SPACING.md,
      lg: SPACING.lg,
    },
  });

  return (
    <View style={globalStyles.container}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        {console.log("📋 MyTasksScreen SearchBox render:", {
          searchSectionStyle: styles.searchSection,
          searchBoxContainerStyle: styles.searchBoxContainer,
        })}
        <SearchBox
          placeholder="Search tasks..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Selected Staff Display */}
        {selectedStaffMembers.length > 0 && (
          <View style={styles.selectedStaffContainer}>
            <View style={styles.selectedStaffHeader}>
              <Ionicons
                name="person-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.selectedStaffLabel}>
                Filtering by:{" "}
                {selectedStaffMembers.map((staff) => staff.name).join(", ")}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedStaffMembers([])}
                style={styles.clearFilterButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Tasks List */}
      <View style={styles.tasksSection}>
        {loading && <LoadingSpinner />}

        {error && (
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Tasks"
            description={error}
            actionText="Try Again"
            onActionPress={() => window.location.reload()}
          />
        )}

        {!loading && !error && filteredTasks.length === 0 && (
          <EmptyState
            icon="checkmark-done-outline"
            title="No Tasks Found"
            description={
              selectedStaffMembers.length > 0 && searchText
                ? `No tasks found for selected staff matching "${searchText}"`
                : selectedStaffMembers.length > 0
                ? `No tasks found for ${selectedStaffMembers
                    .map((s) => s.name)
                    .join(", ")}`
                : searchText
                ? `No tasks match "${searchText}"`
                : "You don't have any tasks assigned yet."
            }
            actionText={
              selectedStaffMembers.length > 0 || searchText
                ? "Clear Filters"
                : undefined
            }
            onActionPress={
              selectedStaffMembers.length > 0 || searchText
                ? () => {
                    setSearchText("");
                    setSelectedStaffMembers([]);
                  }
                : undefined
            }
          />
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <>
            {/* Sort Indicator - Only show when showSortBadge is true */}
            {showSortBadge && (
              <View style={styles.sortIndicator}>
                <Text style={styles.sortText}>
                  Sorted by date (
                  {sortDirection === "desc" ? "newest first" : "oldest first"})
                </Text>
                <Ionicons
                  name={sortDirection === "desc" ? "arrow-down" : "arrow-up"}
                  size={16}
                  color={COLORS.textSecondary}
                />
              </View>
            )}

            {console.log("📋 FLATLIST RENDERING:", {
              dataLength: filteredTasks.length,
              sortDirection,
              taskListStyle: styles.tasksList,
              tasks: filteredTasks.map((t) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                dueDate: t.dueDate,
                hasContent: !!t.title && !!t.description,
              })),
            })}
            <FlatList
              data={filteredTasks}
              renderItem={renderTaskItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.tasksList}
            />
          </>
        )}
      </View>

      {/* Staff Selection Modal */}
      <StaffSelectionModal
        visible={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        title="Select staff members to assign tasks to"
        multiselect={true}
        onConfirm={(staff) => {
          setSelectedStaffMembers(staff);
          console.log(
            "Selected staff for task filtering:",
            staff.map((s) => s.name)
          );
          setShowStaffModal(false);
        }}
      />

      {/* Task Creation Modal */}
      <TaskCreationModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onConfirm={handleTaskCreate}
        assignedStaff={selectedStaffMembers}
      />

      {/* Task Edit Modal */}
      <TaskCreationModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onConfirm={handleTaskEdit}
        assignedStaff={selectedStaffMembers}
        initialTask={selectedTask}
        isEditing={true}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTask && (
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onClose={() => {
            console.log("🚪 DeleteConfirmationModal onClose called");
            setShowDeleteModal(false);
            console.log("🔄 Set showDeleteModal to false");
            setSelectedTask(null);
            console.log("🔄 Cleared selectedTask");
          }}
          onConfirm={handleTaskDelete}
          title="Delete Task"
          message={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </View>
  );
};

// Export staff modal function for header button access
MyTasksScreen.openStaffModal = null;

const styles = StyleSheet.create({
  searchSection: {
    backgroundColor: COLORS.background,
  },

  searchBoxContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: -SPACING.xs,
  },

  selectedStaffContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  selectedStaffHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedStaffLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.sm,
  },

  clearFilterButton: {
    padding: SPACING.xs,
  },

  sortIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },

  sortText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },

  tasksSection: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },

  sectionTitle: {
    ...TEXT_STYLES.h3,
    marginBottom: SPACING.md,
  },

  tasksList: {
    flex: 1,
  },

  completeButton: {
    padding: SPACING.xs,
  },

  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },

  taskDate: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },

  assigneeText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textTertiary,
    flex: 1,
    textAlign: "right",
  },

  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },

  completedTaskCard: {
    backgroundColor: COLORS.gray50,
    borderColor: COLORS.gray300,
    borderWidth: 1,
    ...SHADOWS.subtle,
  },

  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
  },

  taskInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },

  titleRightSection: {
    marginLeft: "auto",
  },

  taskTitle: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.sm,
  },

  taskDescription: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    marginLeft: SPACING.lg, // Indent description to align with title text
    marginBottom: SPACING.xs,
  },

  completedIndicator: {
    padding: SPACING.xs,
  },

  completedTaskTitle: {
    textDecorationLine: "line-through",
    color: COLORS.gray600, // Using a darker, more visible gray
  },

  completedTaskDescription: {
    color: COLORS.gray500, // Using medium gray for better visibility
    textDecorationLine: "line-through",
  },
});

export default MyTasksScreen;
