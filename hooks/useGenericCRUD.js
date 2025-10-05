import { useState, useEffect, useCallback } from "react";

/**
 * Generic CRUD hook for managing data operations
 * This hook provides a standardized way to handle Create, Read, Update, Delete operations
 * with consistent loading states, error handling, and optimistic updates
 *
 * @param {Object} service - Service object with CRUD methods (fetch, create, update, delete)
 * @param {Object} options - Configuration options
 * @param {Array} options.initialData - Initial data array (default: [])
 * @param {boolean} options.autoFetch - Whether to automatically fetch data on mount (default: true)
 * @param {boolean} options.optimisticUpdates - Enable optimistic UI updates (default: true)
 * @param {Function} options.onSuccess - Callback for successful operations
 * @param {Function} options.onError - Callback for failed operations
 * @param {string} options.idField - Field name for item ID (default: 'id')
 *
 * @returns {Object} - CRUD operations and state
 */
export const useGenericCRUD = (service, options = {}) => {
  const {
    initialData = [],
    autoFetch = true,
    optimisticUpdates = true,
    onSuccess = null,
    onError = null,
    idField = "id",
  } = options;

  // State management
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({});

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  // Set operation loading state
  const setOpLoading = useCallback((operation, isLoading) => {
    setOperationLoading((prev) => ({
      ...prev,
      [operation]: isLoading,
    }));
  }, []);

  /**
   * Fetch all items
   */
  const fetchItems = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await service.fetch(params);

        if (response.success) {
          setItems(response.data || response.items || []);
          onSuccess?.("fetch", response.data);
          return { success: true, data: response.data };
        } else {
          throw new Error(response.error || "Failed to fetch items");
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch items";
        setError(errorMessage);
        onError?.("fetch", err);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [service, onSuccess, onError]
  );

  /**
   * Create new item
   */
  const createItem = useCallback(
    async (itemData) => {
      try {
        setOpLoading("create", true);
        setError(null);

        // Optimistic update
        const optimisticItem = optimisticUpdates
          ? {
              [idField]: `temp_${Date.now()}`,
              ...itemData,
              _isOptimistic: true,
            }
          : null;

        if (optimisticItem) {
          setItems((prev) => [...prev, optimisticItem]);
        }

        const response = await service.create(itemData);

        if (response.success) {
          const newItem = response.data || response.item;

          if (optimisticUpdates) {
            // Replace optimistic item with real item
            setItems((prev) =>
              prev.map((item) =>
                item._isOptimistic && item[idField] === optimisticItem[idField]
                  ? newItem
                  : item
              )
            );
          } else {
            // Add new item
            setItems((prev) => [...prev, newItem]);
          }

          onSuccess?.("create", newItem);
          return { success: true, data: newItem };
        } else {
          throw new Error(response.error || "Failed to create item");
        }
      } catch (err) {
        // Revert optimistic update on error
        if (optimisticUpdates && optimisticItem) {
          setItems((prev) =>
            prev.filter(
              (item) =>
                !(
                  item._isOptimistic &&
                  item[idField] === optimisticItem[idField]
                )
            )
          );
        }

        const errorMessage = err.message || "Failed to create item";
        setError(errorMessage);
        onError?.("create", err);
        return { success: false, error: errorMessage };
      } finally {
        setOpLoading("create", false);
      }
    },
    [service, optimisticUpdates, idField, onSuccess, onError, setOpLoading]
  );

  /**
   * Update existing item
   */
  const updateItem = useCallback(
    async (itemId, updateData) => {
      try {
        setOpLoading(`update_${itemId}`, true);
        setError(null);

        // Store original item for rollback
        const originalItem = items.find((item) => item[idField] === itemId);

        // Optimistic update
        if (optimisticUpdates && originalItem) {
          setItems((prev) =>
            prev.map((item) =>
              item[idField] === itemId
                ? { ...item, ...updateData, _isOptimistic: true }
                : item
            )
          );
        }

        const response = await service.update(itemId, updateData);

        if (response.success) {
          const updatedItem = response.data ||
            response.item || { ...originalItem, ...updateData };

          // Update with server response
          setItems((prev) =>
            prev.map((item) =>
              item[idField] === itemId
                ? { ...updatedItem, _isOptimistic: undefined }
                : item
            )
          );

          onSuccess?.("update", updatedItem);
          return { success: true, data: updatedItem };
        } else {
          throw new Error(response.error || "Failed to update item");
        }
      } catch (err) {
        // Revert optimistic update on error
        if (optimisticUpdates && originalItem) {
          setItems((prev) =>
            prev.map((item) => (item[idField] === itemId ? originalItem : item))
          );
        }

        const errorMessage = err.message || "Failed to update item";
        setError(errorMessage);
        onError?.("update", err);
        return { success: false, error: errorMessage };
      } finally {
        setOpLoading(`update_${itemId}`, false);
      }
    },
    [
      service,
      items,
      optimisticUpdates,
      idField,
      onSuccess,
      onError,
      setOpLoading,
    ]
  );

  /**
   * Delete item
   */
  const deleteItem = useCallback(
    async (itemId) => {
      try {
        setOpLoading(`delete_${itemId}`, true);
        setError(null);

        // Store original item for rollback
        const originalItem = items.find((item) => item[idField] === itemId);

        // Optimistic update
        if (optimisticUpdates) {
          setItems((prev) => prev.filter((item) => item[idField] !== itemId));
        }

        const response = await service.delete(itemId);

        if (response.success) {
          // Confirm deletion
          if (!optimisticUpdates) {
            setItems((prev) => prev.filter((item) => item[idField] !== itemId));
          }

          onSuccess?.("delete", { [idField]: itemId });
          return { success: true };
        } else {
          throw new Error(response.error || "Failed to delete item");
        }
      } catch (err) {
        // Revert optimistic update on error
        if (optimisticUpdates && originalItem) {
          setItems((prev) => {
            // Add back the item in its original position
            const newItems = [...prev];
            const originalIndex = items.findIndex(
              (item) => item[idField] === itemId
            );
            newItems.splice(originalIndex, 0, originalItem);
            return newItems;
          });
        }

        const errorMessage = err.message || "Failed to delete item";
        setError(errorMessage);
        onError?.("delete", err);
        return { success: false, error: errorMessage };
      } finally {
        setOpLoading(`delete_${itemId}`, false);
      }
    },
    [
      service,
      items,
      optimisticUpdates,
      idField,
      onSuccess,
      onError,
      setOpLoading,
    ]
  );

  /**
   * Refresh data (alias for fetchItems)
   */
  const refresh = useCallback((params) => fetchItems(params), [fetchItems]);

  /**
   * Get item by ID
   */
  const getItemById = useCallback(
    (itemId) => {
      return items.find((item) => item[idField] === itemId);
    },
    [items, idField]
  );

  /**
   * Check if specific operation is loading
   */
  const isOperationLoading = useCallback(
    (operation, itemId = null) => {
      const key = itemId ? `${operation}_${itemId}` : operation;
      return operationLoading[key] || false;
    },
    [operationLoading]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch]); // Note: fetchItems is not in deps to avoid infinite loops

  return {
    // Data
    items,
    loading,
    error,

    // Operations
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    refresh,

    // Helpers
    getItemById,
    clearError,
    isOperationLoading,

    // State indicators
    isEmpty: items.length === 0,
    hasError: error !== null,
    isLoading: loading,
  };
};

export default useGenericCRUD;
