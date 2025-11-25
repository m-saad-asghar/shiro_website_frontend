/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sort Helpers
 *
 * Utility functions for handling sort operations across Buy, Rent, and Projects pages
 */

/**
 * Close dropdown programmatically
 */
export const closeDropdown = () => {
  setTimeout(() => {
    const closeEvent = new KeyboardEvent("keydown", {
      key: "Escape",
    });
    document.dispatchEvent(closeEvent);
  }, 100);
};

/**
 * Create sort handler for "Most Recent" option
 */
export const createMostRecentHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  setPage: (page: number) => void,
  mutateAsync: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "most recent",
      sort: undefined,
      page: 1,
    };
    setValues(newValues);
    setPage(1);
    mutateAsync(newValues);
    closeDropdown();
  };
};

/**
 * Create sort handler for "Highest Price" option
 */
export const createHighestPriceHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  setPage: (page: number) => void,
  mutateAsync: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "Highest price",
      sort: "max",
      page: 1,
    };
    setValues(newValues);
    setPage(1);
    mutateAsync(newValues);
    closeDropdown();
  };
};

/**
 * Create sort handler for "Lowest Price" option
 */
export const createLowestPriceHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  setPage: (page: number) => void,
  mutateAsync: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "Lowest price",
      sort: "min",
      page: 1,
    };
    setValues(newValues);
    setPage(1);
    mutateAsync(newValues);
    closeDropdown();
  };
};

/**
 * Create sort handler for "Default" option (used in Projects page)
 */
export const createDefaultHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  handleSearch: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "Default",
      sort: undefined,
    };
    setValues(newValues);
    handleSearch(newValues);
    closeDropdown();
  };
};

/**
 * Create sort handler for "Highest Price" with custom search function (used in Projects page)
 */
export const createHighestPriceWithSearchHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  handleSearch: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "Highest price",
      sort: "max",
    };
    setValues(newValues);
    handleSearch(newValues);
    closeDropdown();
  };
};

/**
 * Create sort handler for "Lowest Price" with custom search function (used in Projects page)
 */
export const createLowestPriceWithSearchHandler = (
  values: any,
  typeId: string | number,
  additionalParams: Record<string, any>,
  setValues: (values: any) => void,
  handleSearch: (values: any) => void
) => {
  return () => {
    const newValues = {
      ...values,
      type_id: typeId,
      ...additionalParams,
      sort_name: "Lowest price",
      sort: "min",
    };
    setValues(newValues);
    handleSearch(newValues);
    closeDropdown();
  };
};
