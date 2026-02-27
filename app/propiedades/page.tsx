// app/propiedades/page.tsx
"use client";

import { Suspense, useMemo, useEffect, useRef } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useProperties } from "@/hooks/use-properties";
import { useBarrios } from "@/hooks/use-barrios";
import { usePropertyTypes } from "@/hooks/use-property-types";
import { PropertyCard, PropertyCardSkeleton } from "@/components/properties/property-card";
import { PropertyFiltersSidebar } from "@/components/properties/property-filters-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import type { PropertyOperation, PropertyType } from "@/types/property";

function PropiedadesContent() {
  const [operation] = useQueryState("operation", parseAsString.withDefault(""));
  const [type] = useQueryState("type", parseAsString.withDefault(""));
  const [locationId] = useQueryState("location", parseAsString.withDefault(""));
  const [minPrice] = useQueryState("min_price", parseAsInteger);
  const [maxPrice] = useQueryState("max_price", parseAsInteger);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: barrios = [] } = useBarrios();
  const { data: propertyTypes = [] } = usePropertyTypes();

  const locationName = useMemo(
    () => barrios.find((b) => String(b.id) === locationId)?.name ?? locationId,
    [barrios, locationId]
  );
  const typeName = useMemo(
    () => propertyTypes.find((t) => String(t.id) === type)?.name ?? type,
    [propertyTypes, type]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProperties({
    operation: (operation as PropertyOperation) || undefined,
    type: (type as PropertyType) || undefined,
    location: locationId || undefined,
    min_price: minPrice ?? undefined,
    max_price: maxPrice ?? undefined,
  });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.properties) ?? [],
    [data]
  );
  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    const ids = properties.map((p) => p.id);
    console.log("[Propiedades] Current page IDs:", ids, `(total: ${ids.length}, unique: ${new Set(ids).size})`);
  }, [properties]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log("[Propiedades] Fetching next page...");
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debug: log each page's IDs when new pages arrive (to spot duplicates)
  useEffect(() => {
    if (!data?.pages?.length) return;
    data.pages.forEach((page, index) => {
      const pageIds = page.properties.map((p) => p.id);
      console.log(`[Propiedades] Page ${index + 1} IDs:`, pageIds);
    });
  }, [data?.pages]);

  return (
    <main className="min-h-screen">
      <div className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <PropertyFiltersSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Propiedades
              </h1>
              <p className="text-muted-foreground mb-6">
                {operation ? (
                  <span>
                    {operation === "sell" ? "Venta" : "Alquiler"}
                    {typeName && ` • ${typeName}`}
                    {locationName && ` • ${locationName}`}
                  </span>
                ) : (
                  "Todas las propiedades disponibles"
                )}
              </p>

              {isLoading ? (
                <>
                  <div className="text-sm text-muted-foreground mb-4">
                    Cargando propiedades...
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <PropertyCardSkeleton key={i} />
                    ))}
                  </div>
                </>
              ) : isError ? (
                <div className="text-center py-12 text-muted-foreground">
                  No pudimos cargar las propiedades. Intentá de nuevo más tarde.
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No hay propiedades que coincidan con tu búsqueda.
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {properties.length} de {total}{" "}
                    {total === 1 ? "propiedad" : "propiedades"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}

                    {isFetchingNextPage &&
                      Array.from({ length: 3 }).map((_, i) => (
                        <PropertyCardSkeleton key={`skeleton-${i}`} />
                      ))}
                  </div>

                  <div ref={sentinelRef} className="h-4 mt-8" />

                  {isFetchingNextPage && (
                    <div className="flex justify-center mt-4">
                      <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                  )}

                  {!hasNextPage && properties.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-8">
                      Mostrando todas las propiedades disponibles
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen py-12 px-4">
          <div className="container mx-auto">
            <Skeleton className="h-10 w-48" />
          </div>
        </main>
      }
    >
      <PropiedadesContent />
    </Suspense>
  );
}