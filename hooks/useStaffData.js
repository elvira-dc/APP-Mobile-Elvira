import { useGenericCRUD } from "./useGenericCRUD";
import { MOCK_STAFF, MOCK_EMERGENCY_CONTACTS } from "../constants/mockData";

// Create a mock service adapter for staff operations
const createMockStaffService = () => ({
  async fetch() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, data: MOCK_STAFF };
  },

  async create(staffData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newStaffMember = {
      id: Date.now(),
      ...staffData,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newStaffMember };
  },

  async update(staffId, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: { id: staffId, ...updateData } };
  },

  async delete(staffId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
});

// Custom hook for managing staff data using the generic CRUD hook
export const useStaffData = (options = {}) => {
  const mockService = createMockStaffService();

  const crudResult = useGenericCRUD(mockService, {
    initialData: [],
    autoFetch: true,
    optimisticUpdates: true,
    onSuccess: (operation, data) => {
      console.log(`Staff ${operation} successful:`, data);
      options.onSuccess?.(operation, data);
    },
    onError: (operation, error) => {
      console.error(`Staff ${operation} failed:`, error);
      options.onError?.(operation, error);
    },
    ...options,
  });

  // Legacy method names for backward compatibility
  const legacyMethods = {
    staff: crudResult.items,
    fetchStaff: crudResult.fetchItems,
    updateStaffStatus: (staffId, status) =>
      crudResult.updateItem(staffId, { status }),
  };

  // Staff-specific methods
  const getStaffByShift = (shift) => {
    return crudResult.items.filter((member) => member.shift === shift);
  };

  const getStaffByPosition = (position) => {
    return crudResult.items.filter((member) => member.position === position);
  };

  const getActiveStaff = () => {
    return crudResult.items.filter((member) => member.status === "active");
  };

  const getAvailableStaff = () => {
    return crudResult.items.filter(
      (member) => member.status === "active" || member.status === "available"
    );
  };

  // Return combined API
  return {
    // Generic CRUD methods
    ...crudResult,

    // Legacy method names for backward compatibility
    ...legacyMethods,

    // Staff-specific methods
    getStaffByShift,
    getStaffByPosition,
    getActiveStaff,
    getAvailableStaff,

    // Legacy property names
    loading: crudResult.loading,
    error: crudResult.error,
  };
};

// Custom hook for staff contacts using centralized data
export const useStaffContacts = (options = {}) => {
  const mockService = {
    async fetch() {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, data: MOCK_EMERGENCY_CONTACTS };
    },
  };

  const crudResult = useGenericCRUD(mockService, {
    initialData: [],
    autoFetch: true,
    optimisticUpdates: false, // Contacts are usually read-only
    onSuccess: (operation, data) => {
      console.log(`Contacts ${operation} successful:`, data);
      options.onSuccess?.(operation, data);
    },
    onError: (operation, error) => {
      console.error(`Contacts ${operation} failed:`, error);
      options.onError?.(operation, error);
    },
    ...options,
  });

  // Contact-specific methods
  const getContactsByType = (type) => {
    return crudResult.items.filter((contact) => contact.type === type);
  };

  const getEmergencyContacts = () => {
    return getContactsByType("emergency");
  };

  return {
    // Main data and state
    contacts: crudResult.items,
    loading: crudResult.loading,
    error: crudResult.error,

    // Methods
    fetchContacts: crudResult.fetchItems,
    getContactsByType,
    getEmergencyContacts,
  };
};
