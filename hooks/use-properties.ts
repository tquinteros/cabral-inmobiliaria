// hooks/use-properties.ts
"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProperties, searchProperties } from "@/lib/actions/properties";
import type { PropertySearchParams } from "@/types/property";

const LIMIT = 12;

export function useProperties(params?: Omit<PropertySearchParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["properties", params],
    queryFn: ({ pageParam = 1 }) => {
      const fullParams = { ...params, page: pageParam, limit: LIMIT };
      return hasSearchParams(params)
        ? searchProperties(fullParams)
        : getProperties(fullParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined; // no more pages
    },
    staleTime: 1000 * 60 * 5,
  });
}

function hasSearchParams(params?: Omit<PropertySearchParams, "page">): boolean {
  return !!(
    params?.operation ||
    params?.type ||
    params?.location ||
    params?.min_price ||
    params?.max_price
  );
}