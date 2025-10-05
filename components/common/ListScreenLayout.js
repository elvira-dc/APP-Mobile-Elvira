import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
  FilterTabs,
  LoadingSpinner,
  EmptyState,
} from "@components/common";

/**
 * A reusable layout component that combines common list screen patterns:
 * - Search functionality
 * - Filter tabs (optional)
 * - Loading states
 * - Empty states
 * - List rendering with custom item components
 *
 * This component abstracts the common patterns found in MyTasksScreen,
 * MessagesScreen, and other list-based screens.
 */
const ListScreenLayout = ({
  // Data and search
  data = [],
  loading = false,
  error = null,
  isSearching = false,

  // Search configuration
  searchText = "",
  onSearchTextChange,
  searchPlaceholder = "Search...",

  // Filter configuration (optional)
  showFilters = false,
  filterOptions = [],
  activeFilterIndex = 0,
  onFilterPress,

  // List configuration
  renderItem,
  keyExtractor = (item) => item.id.toString(),

  // Empty state configuration
  emptyStateIcon = "list-outline",
  emptyStateTitle = "No Items",
  emptyStateDescription,
  emptyActionText,
  onEmptyActionPress,

  // Search empty state
  searchEmptyIcon = "search-outline",
  searchEmptyTitle = "No Results Found",
  searchEmptyDescription,
  searchEmptyActionText = "Clear Search",

  // Error state
  errorIcon = "alert-circle-outline",
  errorTitle = "Error Loading Data",
  errorActionText = "Try Again",
  onErrorActionPress,

  // Layout options
  title,
  showItemCount = true,
  keyboardAvoiding = false,
  contentContainerStyle,
  listStyle,

  // Additional props
  ...flatListProps
}) => {
  const getDisplayTitle = () => {
    if (!title) return null;

    let displayTitle = title;
    if (showItemCount && data.length > 0) {
      displayTitle += ` (${data.length})`;
    }
    return displayTitle;
  };

  const getEmptyStateProps = () => {
    if (error) {
      return {
        icon: errorIcon,
        title: errorTitle,
        description: error,
        actionText: errorActionText,
        onActionPress: onErrorActionPress,
      };
    }

    if (searchText) {
      return {
        icon: searchEmptyIcon,
        title: searchEmptyTitle,
        description: searchEmptyDescription || `No items match "${searchText}"`,
        actionText: searchEmptyActionText,
        onActionPress: () => onSearchTextChange?.(""),
      };
    }

    return {
      icon: emptyStateIcon,
      title: emptyStateTitle,
      description: emptyStateDescription || "No items available",
      actionText: emptyActionText,
      onActionPress: onEmptyActionPress,
    };
  };

  const shouldShowEmptyState = !loading && !isSearching && data.length === 0;
  const shouldShowList = !loading && !isSearching && data.length > 0;

  const content = (
    <View style={[styles.container, contentContainerStyle]}>
      {/* Search Section */}
      {onSearchTextChange && (
        <SearchBox
          placeholder={searchPlaceholder}
          value={searchText}
          onChangeText={onSearchTextChange}
        />
      )}

      {/* Filter Tabs */}
      {showFilters && filterOptions.length > 0 && (
        <FilterTabs
          options={filterOptions}
          activeIndex={activeFilterIndex}
          onPress={onFilterPress}
          variant="primary"
          size="medium"
        />
      )}

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title */}
        {title && <Text style={styles.sectionTitle}>{getDisplayTitle()}</Text>}

        {/* Loading State */}
        {(loading || isSearching) && <LoadingSpinner />}

        {/* Empty State */}
        {shouldShowEmptyState && <EmptyState {...getEmptyStateProps()} />}

        {/* List */}
        {shouldShowList && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            style={[styles.list, listStyle]}
            keyboardShouldPersistTaps="handled"
            {...flatListProps}
          />
        )}
      </View>
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return <View style={globalStyles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },

  sectionTitle: {
    ...TEXT_STYLES.h3,
    marginBottom: SPACING.md,
  },

  list: {
    flex: 1,
  },
});

export default ListScreenLayout;
