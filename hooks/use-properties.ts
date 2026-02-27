"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/lib/actions/properties";
import type { PropertySearchParams } from "@/types/property";

export function useProperties(params?: PropertySearchParams) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
}
