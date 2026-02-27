"use client";

import { useQuery } from "@tanstack/react-query";
import { getPropertyTypes } from "@/lib/actions/property-types";

export function usePropertyTypes() {
  return useQuery({
    queryKey: ["property-types"],
    queryFn: getPropertyTypes,
    staleTime: 1000 * 60 * 60, // 1 hour - property types rarely change
  });
}
