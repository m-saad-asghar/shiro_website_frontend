/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Custom Hook for MultiSearch Logic
 * Extracted from MultiSearch.tsx to separate concerns
 */

import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ValueContext } from "@/Context/ValueContext";
import UseQueryPost from "@/hooks/useQueryPost";
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import StaticServices from "@/Services/StaticServices";
import { getPropertyTypeSlug } from "@/helpers/propertyTypeHelper";

export const useMultiSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<undefined | string>(undefined);

  // Get filter data
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const filterPrices = filter?.prices;
  const filterBedrooms = filter?.bedrooms;
  const filterPropertyTypes = filter?.property_types;

  // Get regions data
  const { data: regionsData } = useQueryGet(["regions"], StaticServices.region);

  // State for filtered regions
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]);

  // Context values
  const {
    values,
    setValues,
    valueSearch,
    setValueSearch,
    searchId,
    setSearchId,
  } = useContext(ValueContext);

  // Search API
  const { mutateAsync, data: options } = UseQueryPost(
    ["search"],
    PropertiesServices.Search
  );

  /**
   * Add value to search (property or region)
   */
  const handelAddValue = (item: any, type: "property" | "region") => {
    const uniqueId = `${type}_${item?.id}`;

    // Check if already exists
    const alreadyExists = valueSearch.some(
      (searchItem: any) =>
        searchItem.id === item?.id && searchItem.type === type
    );

    if (alreadyExists) {
      return;
    }

    // Add to valueSearch
    setValueSearch((prev: any) => [...prev, { ...item, type, uniqueId }]);

    // For properties, add to searchId array
    if (type === "property") {
      setSearchId((prev: any) => {
        if (prev.some((id: any) => id == item?.id)) {
          return [...prev];
        } else {
          return [...prev, item?.id];
        }
      });
    }

    // Clear search input
    setValues((prev: any) => ({
      ...prev,
      search: "",
    }));
  };

  /**
   * Remove selected value
   */
  const handleRemoveValue = (item: any) => {
    setValueSearch((prev: any) =>
      prev.filter((searchItem: any) => searchItem.uniqueId !== item.uniqueId)
    );

    if (item.type === "property") {
      setSearchId((prev: any) => prev.filter((id: any) => id !== item.id));
    }

    // Update region_name in values
    if (item.type === "region") {
      setValues((prev: any) => {
        const remainingRegions = valueSearch
          .filter(
            (v: any) => v.type === "region" && v.uniqueId !== item.uniqueId
          )
          .map((v: any) => v.name);
        return {
          ...prev,
          region_name:
            remainingRegions.length > 0
              ? remainingRegions.join(",")
              : undefined,
        };
      });
    }
  };

  /**
   * Handle search input change
   */
  const onSearch = (e: any) => {
    setValues((prev: any) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  // Sync property_ids with searchId
  useEffect(() => {
    if (searchId) {
      setValues((prev: any) => ({
        ...prev,
        property_ids: searchId,
      }));
    }
  }, [searchId, setValues]);

  // Get search suggestions when typing
  useEffect(() => {
    if (!values) return;

    if (values?.search && values?.search.length > 0) {
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      mutateAsync(searchBody);
    } else if (!values?.search || values?.search.length === 0) {
      const { property_ids, ...searchBodyWithoutIds } = values;
      const searchBody =
        values?.type_name !== "new-projects"
          ? { ...searchBodyWithoutIds, is_sale: true }
          : searchBodyWithoutIds;
      if (values?.type_id) {
        mutateAsync(searchBody);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.search, values?.type_id, values?.type_name]);

  // Filter regions based on search input
  useEffect(() => {
    if (values?.search && values?.search.length > 0 && regionsData?.region) {
      const searchTerm = values.search.toLowerCase().trim();
      const filtered = regionsData.region.filter((region: any) => {
        const nameMatch = region.name?.toLowerCase().includes(searchTerm);
        return nameMatch;
      });
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  }, [values?.search, regionsData]);

  // Sync region_name/region_names with valueSearch
  useEffect(() => {
    const selectedRegions = valueSearch
      .filter((v: any) => v.type === "region")
      .map((v: any) => v.name);

    setValues((prev: any) => {
      // Remove old region filters
      const { region_name, region_names, ...rest } = prev;

      // If no regions selected, return without region filters
      if (selectedRegions.length === 0) {
        return rest;
      }

      // If only one region, use region_name
      if (selectedRegions.length === 1) {
        return {
          ...rest,
          region_name: selectedRegions[0],
        };
      }

      // If multiple regions, use region_names
      return {
        ...rest,
        region_names: selectedRegions,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueSearch]);

  /**
   * Handle form submit - Navigate to appropriate page
   */
  const onSubmit = () => {
    if (!values?.type_name || !values?.type_id) {
      return;
    }

    // Build search state to pass to navigation
    const searchState: any = {
      property_ids: searchId || values?.property_ids || [],
      valueSearch: valueSearch || [],
      search: values?.search,
      property_name: values?.property_name,
      property_type_id: values?.property_type_id,
      price_min: values?.price_min,
      price_max: values?.price_max,
      bedroom_min: values?.bedroom_min,
      bedroom_max: values?.bedroom_max,
      area: values?.area,
      developer_id: values?.developer_id,
      developer_name: values?.developer_name,
      sort: values?.sort,
      sort_name: values?.sort_name,
      type_id: values?.type_id,
      type_name: values?.type_name,
      is_sale: values?.type_name !== "new-projects" ? true : undefined,
      region_name: values?.region_name,
      region_names: values?.region_names,
    };

    // Build URL with all filters
    let url = "";

    if (values?.type_name === "buy/properties-for-sale") {
      url =
        `/buy/properties-for-sale` +
        (values?.property_name
          ? `/${getPropertyTypeSlug(values.property_name)}`
          : "") +
        (values?.bedroom_min && values?.bedroom_max !== undefined
          ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
          : values?.bedroom_min !== undefined
          ? `/more-than-${values?.bedroom_min}-bedrooms`
          : values?.bedroom_max !== undefined
          ? `/under-${values?.bedroom_max}-bedrooms`
          : "") +
        (values?.price_min && values?.price_max !== undefined
          ? `/between-${values?.price_min}-${values?.price_max}`
          : values?.price_min !== undefined
          ? `/above-${values?.price_min}`
          : values?.price_max !== undefined
          ? `/below-${values?.price_max}`
          : "");
    } else if (values?.type_name === "rent/properties-for-rent") {
      url =
        `/rent/properties-for-rent` +
        (values?.property_name
          ? `/${getPropertyTypeSlug(values.property_name)}`
          : "") +
        (values?.bedroom_min && values?.bedroom_max !== undefined
          ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
          : values?.bedroom_min !== undefined
          ? `/more-than-${values?.bedroom_min}-bedrooms`
          : values?.bedroom_max !== undefined
          ? `/under-${values?.bedroom_max}-bedrooms`
          : "") +
        (values?.price_min && values?.price_max !== undefined
          ? `/between-${values?.price_min}-${values?.price_max}`
          : values?.price_min !== undefined
          ? `/above-${values?.price_min}`
          : values?.price_max !== undefined
          ? `/below-${values?.price_max}`
          : "");
    } else {
      // new-projects
      url =
        `/new-projects` +
        (values?.property_name
          ? `/${getPropertyTypeSlug(values.property_name)}`
          : "") +
        (values?.bedroom_min && values?.bedroom_max !== undefined
          ? `/with-${values?.bedroom_min}-to-${values?.bedroom_max}-bedrooms`
          : values?.bedroom_min !== undefined
          ? `/more-than-${values?.bedroom_min}-bedrooms`
          : values?.bedroom_max !== undefined
          ? `/under-${values?.bedroom_max}-bedrooms`
          : "") +
        (values?.price_min && values?.price_max !== undefined
          ? `/between-${values?.price_min}-${values?.price_max}`
          : values?.price_min !== undefined
          ? `/above-${values?.price_min}`
          : values?.price_max !== undefined
          ? `/below-${values?.price_max}`
          : "");
    }

    // Navigate with state
    navigate(url, { state: searchState });
  };

  return {
    id,
    setId,
    filter,
    filterPrices,
    filterBedrooms,
    filterPropertyTypes,
    regionsData,
    filteredRegions,
    values,
    setValues,
    valueSearch,
    setValueSearch,
    searchId,
    setSearchId,
    options,
    handelAddValue,
    handleRemoveValue,
    onSearch,
    onSubmit,
    navigate,
    location,
  };
};
