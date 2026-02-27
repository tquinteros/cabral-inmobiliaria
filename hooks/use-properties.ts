"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties, searchProperties } from "@/lib/actions/properties";
import type { PropertySearchParams } from "@/types/property";

function hasSearchParams(params?: PropertySearchParams): boolean {
  if (!params) return false;
  return !!(
    params.operation ||
    params.location ||
    params.type ||
    params.min_price != null ||
    params.max_price != null
  );
}

export function useProperties(params?: PropertySearchParams) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () =>
      hasSearchParams(params)
        ? searchProperties(params!)
        : getProperties(params),
  });
}
