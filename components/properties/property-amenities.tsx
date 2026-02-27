"use client";

import {
  CarIcon,
  TreePineIcon,
  WavesIcon,
  HomeIcon,
  DumbbellIcon,
  WifiIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pool: WavesIcon,
  garage: CarIcon,
  garden: TreePineIcon,
  balcony: HomeIcon,
  gym: DumbbellIcon,
  wifi: WifiIcon,
};

export function PropertyAmenities({
  amenities = [],
  className,
}: {
  amenities?: string[];
  className?: string;
}) {
  const normalized = amenities.map((a) => a.toLowerCase().replace(/\s/g, "_"));
  const unique = [...new Set(normalized)];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {unique.map((key) => {
        const Icon = AMENITY_ICONS[key] ?? HomeIcon;
        const label =
          key === "pool"
            ? "Pileta"
            : key === "garage"
              ? "Garage"
              : key === "garden"
                ? "Jardín"
                : key === "balcony"
                  ? "Balcón"
                  : key === "gym"
                    ? "Gimnasio"
                    : key === "wifi"
                      ? "Wi-Fi"
                      : key;
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            title={label}
          >
            <Icon className="size-3.5" />
            <span className="capitalize">{label}</span>
          </span>
        );
      })}
    </div>
  );
}
