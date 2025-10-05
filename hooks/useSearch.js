import { useState, useMemo } from "react";
import { debounce } from "@utils/helpers";

/**
 * Custom hook for search functionality with filtering, debouncing, and caching
 * @param {Array} data - The array of items to search through
 * @param {Array} searchFields - Array of field names to search in (e.g., ['name', 'email', 'department'])
 * @param {Object} options - Configuration options
 * @param {number} options.debounceDelay - Delay for debouncing search input (default: 300ms)
 * @param {boolean} options.caseSensitive - Whether search should be case sensitive (default: false)
 * @param {boolean} options.exactMatch - Whether to use exact match or partial match (default: false)
 * @param {Function} options.customFilter - Custom filter function for advanced filtering
 * @returns {Object} - { searchText, setSearchText, filteredData, clearSearch, hasResults }
 */
export const useSearch = (data = [], searchFields = [], options = {}) => {
  const {
    debounceDelay = 300,
    caseSensitive = false,
    exactMatch = false,
    customFilter = null,
  } = options;

  const [searchText, setSearchTextState] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Debounced search text setter
  const debouncedSetSearch = useMemo(
    () => debounce((text) => setDebouncedSearchText(text), debounceDelay),
    [debounceDelay]
  );

  // Update search text and trigger debounced search
  const setSearchText = (text) => {
    setSearchTextState(text);
    debouncedSetSearch(text);
  };

  // Filtered data based on search criteria
  const filteredData = useMemo(() => {
    // Return all data if no search text
    if (!debouncedSearchText.trim()) {
      return data;
    }

    const searchQuery = caseSensitive
      ? debouncedSearchText.trim()
      : debouncedSearchText.trim().toLowerCase();

    return data.filter((item) => {
      // Use custom filter if provided
      if (customFilter) {
        return customFilter(item, searchQuery, searchFields);
      }

      // Default search logic
      return searchFields.some((field) => {
        const fieldValue = getNestedValue(item, field);

        if (fieldValue == null) return false;

        const stringValue = caseSensitive
          ? String(fieldValue)
          : String(fieldValue).toLowerCase();

        return exactMatch
          ? stringValue === searchQuery
          : stringValue.includes(searchQuery);
      });
    });
  }, [
    data,
    debouncedSearchText,
    searchFields,
    caseSensitive,
    exactMatch,
    customFilter,
  ]);

  // Clear search
  const clearSearch = () => {
    setSearchTextState("");
    setDebouncedSearchText("");
  };

  // Check if there are results
  const hasResults = filteredData.length > 0;
  const hasSearched = debouncedSearchText.trim().length > 0;

  return {
    searchText,
    setSearchText,
    filteredData,
    clearSearch,
    hasResults,
    hasSearched,
    isSearching: searchText !== debouncedSearchText, // Indicates if search is being debounced
  };
};

/**
 * Specialized search hook for staff/contacts
 * @param {Array} staffData - Array of staff objects
 * @param {Object} filters - Additional filters (department, status, etc.)
 * @returns {Object} - Search results with staff-specific helpers
 */
export const useStaffSearch = (staffData = [], filters = {}) => {
  const { searchText = "", ...otherFilters } = filters;
  const searchFields = ["name", "position", "department", "email"];

  const customFilter = (item, query, fields) => {
    // Apply additional filters first
    if (
      otherFilters.department &&
      item.department !== otherFilters.department
    ) {
      return false;
    }
    if (
      otherFilters.isOnline !== undefined &&
      item.isOnline !== otherFilters.isOnline
    ) {
      return false;
    }
    if (otherFilters.status && item.status !== otherFilters.status) {
      return false;
    }

    // Then apply search query
    return fields.some((field) => {
      const fieldValue = getNestedValue(item, field);
      return fieldValue && String(fieldValue).toLowerCase().includes(query);
    });
  };

  const searchResult = useSearch(staffData, searchFields, { customFilter });

  // Set search text if provided
  if (searchText && searchResult.searchText !== searchText) {
    searchResult.setSearchText(searchText);
  }

  return {
    ...searchResult,
    // Staff-specific helpers
    onlineStaff: searchResult.filteredData.filter((staff) => staff.isOnline),
    staffByDepartment: (dept) =>
      searchResult.filteredData.filter((staff) => staff.department === dept),
  };
};

/**
 * Specialized search hook for tasks
 * @param {Array} taskData - Array of task objects
 * @param {Object} filters - Additional filters (status, priority, etc.)
 * @returns {Object} - Search results with task-specific helpers
 */
export const useTaskSearch = (taskData = [], filters = {}) => {
  const { searchText = "", ...otherFilters } = filters;
  const searchFields = ["title", "description", "assignee", "assignedTo"];

  const customFilter = (item, query, fields) => {
    // Apply additional filters first
    if (otherFilters.status && item.status !== otherFilters.status) {
      return false;
    }
    if (otherFilters.priority && item.priority !== otherFilters.priority) {
      return false;
    }
    if (
      otherFilters.assignedTo &&
      item.assignedTo !== otherFilters.assignedTo
    ) {
      return false;
    }

    // Then apply search query
    return fields.some((field) => {
      const fieldValue = getNestedValue(item, field);
      return fieldValue && String(fieldValue).toLowerCase().includes(query);
    });
  };

  const searchResult = useSearch(taskData, searchFields, { customFilter });

  // Set search text if provided
  if (searchText && searchResult.searchText !== searchText) {
    searchResult.setSearchText(searchText);
  }

  return {
    ...searchResult,
    // Task-specific helpers
    tasksByStatus: (status) =>
      searchResult.filteredData.filter((task) => task.status === status),
    tasksByPriority: (priority) =>
      searchResult.filteredData.filter((task) => task.priority === priority),
    pendingTasks: searchResult.filteredData.filter(
      (task) => task.status === "pending"
    ),
    highPriorityTasks: searchResult.filteredData.filter(
      (task) => task.priority === "high"
    ),
  };
};

/**
 * Specialized search hook for messages/conversations
 * @param {Array} messageData - Array of message objects
 * @param {Object} filters - Additional filters (unread, department, etc.)
 * @returns {Object} - Search results with message-specific helpers
 */
export const useMessageSearch = (messageData = [], filters = {}) => {
  const { searchText = "", ...otherFilters } = filters;
  const searchFields = ["sender", "lastMessage", "department"];

  const customFilter = (item, query, fields) => {
    // Apply additional filters first
    if (
      otherFilters.unread !== undefined &&
      item.unread !== otherFilters.unread
    ) {
      return false;
    }
    if (
      otherFilters.department &&
      item.department !== otherFilters.department
    ) {
      return false;
    }

    // Then apply search query
    return fields.some((field) => {
      const fieldValue = getNestedValue(item, field);
      return fieldValue && String(fieldValue).toLowerCase().includes(query);
    });
  };

  const searchResult = useSearch(messageData, searchFields, { customFilter });

  // Set search text if provided
  if (searchText && searchResult.searchText !== searchText) {
    searchResult.setSearchText(searchText);
  }

  return {
    ...searchResult,
    // Message-specific helpers
    unreadMessages: searchResult.filteredData.filter((msg) => msg.unread),
    messagesByDepartment: (dept) =>
      searchResult.filteredData.filter((msg) => msg.department === dept),
  };
};

// Helper function to get nested object values (e.g., 'user.profile.name')
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

export default useSearch;
