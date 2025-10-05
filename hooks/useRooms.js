import { useGenericCRUD } from "./useGenericCRUD";
import { MOCK_ROOMS } from "../constants/mockData";

// Create a mock service adapter for room operations
const createMockRoomService = () => ({
  async fetch() {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, data: MOCK_ROOMS };
  },

  async create(roomData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newRoom = {
      id: Date.now(),
      ...roomData,
      status: "clean",
      lastCleaned: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newRoom };
  },

  async update(roomId, updateData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: { id: roomId, ...updateData } };
  },

  async delete(roomId) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true };
  },
});

// Custom hook for managing rooms using the generic CRUD hook
export const useRooms = (options = {}) => {
  const mockService = createMockRoomService();

  const crudResult = useGenericCRUD(mockService, {
    initialData: [],
    autoFetch: true,
    optimisticUpdates: true,
    onSuccess: (operation, data) => {
      console.log(`Room ${operation} successful:`, data);
      options.onSuccess?.(operation, data);
    },
    onError: (operation, error) => {
      console.error(`Room ${operation} failed:`, error);
      options.onError?.(operation, error);
    },
    ...options,
  });

  // Legacy method names for backward compatibility
  const legacyMethods = {
    rooms: crudResult.items,
    fetchRooms: crudResult.fetchItems,
    updateRoomStatus: (roomId, status) => {
      const updateData = {
        status,
        lastCleaned: status === "clean" ? new Date().toISOString() : undefined,
      };
      return crudResult.updateItem(roomId, updateData);
    },
  };

  // Room-specific methods
  const getRoomsByStatus = (status) => {
    return crudResult.items.filter((room) => room.status === status);
  };

  const getRoomsByType = (type) => {
    return crudResult.items.filter((room) => room.type === type);
  };

  const getDirtyRooms = () => {
    return getRoomsByStatus("dirty");
  };

  const getCleanRooms = () => {
    return getRoomsByStatus("clean");
  };

  const getMaintenanceRooms = () => {
    return getRoomsByStatus("maintenance");
  };

  const getRoomsNeedingMaintenance = () => {
    const now = new Date();
    return crudResult.items.filter(
      (room) => room.nextMaintenance && new Date(room.nextMaintenance) <= now
    );
  };

  // Return combined API
  return {
    // Generic CRUD methods
    ...crudResult,

    // Legacy method names for backward compatibility
    ...legacyMethods,

    // Room-specific methods
    getRoomsByStatus,
    getRoomsByType,
    getDirtyRooms,
    getCleanRooms,
    getMaintenanceRooms,
    getRoomsNeedingMaintenance,

    // Legacy property names
    loading: crudResult.loading,
    error: crudResult.error,
  };
};

// Custom hook for individual room status management
export const useRoomStatus = (roomId, options = {}) => {
  const mockService = {
    async fetch() {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find room in mock data or create a default one
      const room = MOCK_ROOMS.find((r) => r.id === roomId) || {
        id: roomId,
        number: `Room ${roomId}`,
        type: "Standard",
        status: "clean",
        lastCleaned: new Date().toISOString(),
        nextMaintenance: new Date(Date.now() + 86400000).toISOString(),
        tasks: [],
        notes: "",
      };

      return { success: true, data: room };
    },

    async update(_, updateData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, data: { id: roomId, ...updateData } };
    },
  };

  const crudResult = useGenericCRUD(mockService, {
    initialData: null,
    autoFetch: !!roomId,
    optimisticUpdates: true,
    onSuccess: (operation, data) => {
      console.log(`Room ${roomId} ${operation} successful:`, data);
      options.onSuccess?.(operation, data);
    },
    onError: (operation, error) => {
      console.error(`Room ${roomId} ${operation} failed:`, error);
      options.onError?.(operation, error);
    },
    ...options,
  });

  return {
    room: crudResult.items, // Single item for this hook
    loading: crudResult.loading,
    error: crudResult.error,
    fetchRoom: crudResult.fetchItems,
    updateRoom: (updateData) => crudResult.updateItem(roomId, updateData),
  };
};
