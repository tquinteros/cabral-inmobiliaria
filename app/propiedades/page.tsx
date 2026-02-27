"use client";

import { Suspense, useMemo } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useProperties } from "@/hooks/use-properties";
import { useBarrios } from "@/hooks/use-barrios";
import { usePropertyTypes } from "@/hooks/use-property-types";
import { PropertyCard, PropertyCardSkeleton } from "@/components/properties/property-card";
import { PropertyFiltersSidebar } from "@/components/properties/property-filters-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyOperation, PropertyType } from "@/types/property";

function PropiedadesContent() {
  const [operation] = useQueryState(
    "operation",
    parseAsString.withDefault("")
  );
  const [type] = useQueryState("type", parseAsString.withDefault(""));
  const [locationId] = useQueryState("location", parseAsString.withDefault(""));
  const [minPrice] = useQueryState("min_price", parseAsInteger);
  const [maxPrice] = useQueryState("max_price", parseAsInteger);
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

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

  const { data, isLoading, isError } = useProperties({
    operation: (operation as PropertyOperation) || undefined,
    type: (type as PropertyType) || undefined,
    location: locationId || undefined,
    min_price: minPrice ?? undefined,
    max_price: maxPrice ?? undefined,
    limit: 12,
    page: page ?? 1,
  });

  const properties = data?.properties ?? [];
  const total = data?.total ?? 0;

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
                {operation && (
                  <span>
                    {operation === "sell" ? "Venta" : "Alquiler"}
                    {typeName && ` • ${typeName}`}
                    {locationName && ` • ${locationName}`}
                  </span>
                )}
                {!operation && !type && !locationId &&
                  "Todas las propiedades disponibles"}
              </p>

              {isLoading ? (
                <>
                  <div className="text-sm text-muted-foreground mb-4">
                    Cargando propiedades...
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <PropertyCardSkeleton key={index} />
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
                    {total} {total === 1 ? "propiedad encontrada" : "propiedades encontradas"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
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
            <div className="flex gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </main>
      }
    >
      <PropiedadesContent />
    </Suspense>
  );
}
