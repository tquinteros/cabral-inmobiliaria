"use client";

import { useQuery } from "@tanstack/react-query";
import { getStateDivisions } from "@/lib/actions/locations";

export function useBarrios() {
  return useQuery({
    queryKey: ["barrios", 146],
    queryFn: () => getStateDivisions(146),
    staleTime: 1000 * 60 * 60, // 1 hour - barrios rarely change
  });
}
