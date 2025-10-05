import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
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
  LoadingSpinner,
  EmptyState,
  StatusIndicator,
  Badge,
  RoomGridItem,
} from "@components/common";
import { RoomDetailModal } from "@components/modals";
import { useRooms } from "@hooks/useRooms";

const RoomsScreen = ({ onFilteredCountChange }) => {
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { items: rooms, loading, error } = useRooms();

  const filterOptions = ["All", "DND", "Clean", "Not Clean", "In Progress"];
  const scrollViewRef = useRef(null);

  // Filter rooms based on active filter
  const filteredRooms = useMemo(() => {
    if (activeFilterIndex === 0) return rooms; // All

    const filterMap = {
      1: (room) => room.doNotDisturb === true, // DND
      2: (room) => room.status === "clean", // Clean
      3: (room) => room.status === "dirty", // Not Clean
      4: (room) => room.status === "in-progress", // In Progress
    };

    const filterFunction = filterMap[activeFilterIndex];
    return filterFunction ? rooms.filter(filterFunction) : rooms;
  }, [rooms, activeFilterIndex]);

  // Update navigation header when filtered count changes
  React.useEffect(() => {
    if (onFilteredCountChange) {
      onFilteredCountChange(filteredRooms.length);
    }
  }, [filteredRooms.length, onFilteredCountChange]);

  const getStatusColor = (status) => {
    switch (status) {
      case "clean":
        return COLORS.success;
      case "dirty":
        return COLORS.error;
      case "in-progress":
        return COLORS.warning;
      case "maintenance":
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "clean":
        return "checkmark-circle";
      case "dirty":
        return "close-circle";
      case "in-progress":
        return "time";
      case "maintenance":
        return "construct";
      default:
        return "help-circle";
    }
  };

  const handleFilterPress = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // If clicking on the same active filter (and it's not "All"), reset to "All"
    if (index === activeFilterIndex && index !== 0) {
      setActiveFilterIndex(0); // Reset to "All"
      // Center the "All" button
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToIndex({
          index: 0,
          animated: true,
          viewPosition: 0.5, // Center the item
        });
      }
    } else {
      // Normal filter selection
      setActiveFilterIndex(index);
      // Center the selected button
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Center the item
        });
      }
    }
  };

  const handleRoomPress = (room) => {
    console.log("Room details:", room);
    // TODO: Navigate to room details or show room management modal
  };

  const handleRoomLongPress = (room) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  const renderFilterItem = ({ item, index }) => {
    const isActive = index === activeFilterIndex;
    return (
      <TouchableOpacity
        style={[styles.filterItem, isActive && styles.activeFilterItem]}
        onPress={() => handleFilterPress(index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRoomItem = ({ item: room, index }) => (
    <View style={styles.gridItemContainer}>
      <RoomGridItem
        room={room}
        onPress={handleRoomPress}
        onLongPress={handleRoomLongPress}
      />
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Filter Menu */}
      <View style={styles.filterSection}>
        <FlatList
          ref={scrollViewRef}
          data={filterOptions}
          renderItem={renderFilterItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScrollView}
        />
      </View>

      {/* Rooms List */}
      <View style={styles.roomsSection}>
        {loading && <LoadingSpinner />}

        {error && (
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Rooms"
            description={error}
            actionText="Try Again"
            onActionPress={() => window.location.reload()}
          />
        )}

        {!loading && !error && filteredRooms.length === 0 && (
          <EmptyState
            icon="home-outline"
            title="No Rooms"
            description="No rooms available."
          />
        )}

        {!loading && !error && filteredRooms.length > 0 && (
          <FlatList
            data={filteredRooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            style={styles.roomsList}
            contentContainerStyle={styles.roomsListContent}
            key={`grid-${activeFilterIndex}-${filteredRooms.length}`} // Force re-render for consistent grid
            extraData={activeFilterIndex} // Ensure re-render when filter changes
            ItemSeparatorComponent={() => (
              <View style={{ height: SPACING.sm }} />
            )}
          />
        )}
      </View>

      {/* Room Detail Modal */}
      <RoomDetailModal
        visible={isModalVisible}
        room={selectedRoom}
        onClose={handleCloseModal}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  filterSection: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },

  filterScrollView: {
    flexGrow: 0,
  },

  filterContainer: {
    paddingHorizontal: SPACING.md,
    alignItems: "center",
  },

  filterItem: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  activeFilterItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  filterText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: "500",
    fontSize: 14,
  },

  activeFilterText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  roomsSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },

  roomsList: {
    flex: 1,
  },

  roomsListContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },

  gridItemContainer: {
    width: "25%", // Exactly 25% for 4 columns
    paddingHorizontal: SPACING.xs / 2,
    marginBottom: SPACING.sm,
  },

  gridRow: {
    justifyContent: "flex-start",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
});

export default RoomsScreen;
