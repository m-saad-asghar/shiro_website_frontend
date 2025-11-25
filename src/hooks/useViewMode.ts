import { useState, useCallback } from "react";

/**
 * Custom hook for managing view mode (grid/list) with localStorage persistence
 *
 * @param storageKey - Key to use for localStorage (e.g., "buyViewMode", "rentViewMode")
 * @returns Object containing viewMode state and handler
 */
export const useViewMode = (storageKey: string) => {
  // Get initial view mode from localStorage or default to "grid"
  const getInitialViewMode = (): "grid" | "list" => {
    const savedViewMode = localStorage.getItem(storageKey);
    return (savedViewMode as "grid" | "list") || "grid";
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">(getInitialViewMode);

  const handleViewModeChange = useCallback(
    (mode: "grid" | "list") => {
      setViewMode(mode);
      // Save to localStorage
      localStorage.setItem(storageKey, mode);
      // Close dropdown after selection
      setTimeout(() => {
        const closeEvent = new KeyboardEvent("keydown", {
          key: "Escape",
        });
        document.dispatchEvent(closeEvent);
      }, 100);
    },
    [storageKey]
  );

  return {
    viewMode,
    handleViewModeChange,
  };
};
