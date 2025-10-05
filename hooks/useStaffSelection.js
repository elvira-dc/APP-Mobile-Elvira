import { useState, useMemo, useCallback } from "react";
import { MOCK_STAFF, DEPARTMENTS } from "@constants/mockData";

export const useStaffSelection = ({
  initialSelectedIds = [],
  multiselect = true,
  onSelectionChange,
  excludeIds = [],
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Filter staff based on search and department
  const filteredStaff = useMemo(() => {
    console.log("MOCK_STAFF data:", MOCK_STAFF.length, "items");
    console.log("First staff member:", MOCK_STAFF[0]);
    let filtered = MOCK_STAFF.filter((staff) => !excludeIds.includes(staff.id));

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (staff) =>
          staff.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.position.toLowerCase().includes(query) ||
          staff.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchText, selectedDepartment, excludeIds]);

  // Get selected staff objects
  const selectedStaff = useMemo(() => {
    return MOCK_STAFF.filter((staff) => selectedIds.has(staff.id));
  }, [selectedIds]);

  // Toggle staff selection
  const toggleStaff = useCallback(
    (staffId) => {
      setSelectedIds((prevIds) => {
        const newIds = new Set(prevIds);

        if (newIds.has(staffId)) {
          newIds.delete(staffId);
        } else {
          if (!multiselect) {
            newIds.clear();
          }
          newIds.add(staffId);
        }

        // Trigger callback if provided
        const selectedStaffList = MOCK_STAFF.filter((staff) =>
          newIds.has(staff.id)
        );
        onSelectionChange?.(selectedStaffList, Array.from(newIds));

        return newIds;
      });
    },
    [multiselect, onSelectionChange]
  );

  // Select all filtered staff
  const selectAll = useCallback(() => {
    const newIds = new Set(filteredStaff.map((staff) => staff.id));
    setSelectedIds(newIds);

    const selectedStaffList = filteredStaff;
    onSelectionChange?.(selectedStaffList, Array.from(newIds));
  }, [filteredStaff, onSelectionChange]);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange?.([], []);
  }, [onSelectionChange]);

  // Get department counts for badge display
  const departmentCounts = useMemo(() => {
    const counts = {};
    DEPARTMENTS.forEach((dept) => {
      if (dept.id === "all") {
        counts[dept.id] = MOCK_STAFF.length;
      } else {
        counts[dept.id] = MOCK_STAFF.filter(
          (staff) => staff.department.toLowerCase() === dept.id.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, []);

  return {
    // State
    selectedIds,
    selectedStaff,
    searchText,
    selectedDepartment,
    filteredStaff,
    departmentCounts,

    // Actions
    setSearchText,
    setSelectedDepartment,
    toggleStaff,
    selectAll,
    clearAll,

    // Computed
    selectedCount: selectedIds.size,
    hasSelection: selectedIds.size > 0,
    isAllFilteredSelected:
      filteredStaff.length > 0 &&
      filteredStaff.every((staff) => selectedIds.has(staff.id)),
  };
};
