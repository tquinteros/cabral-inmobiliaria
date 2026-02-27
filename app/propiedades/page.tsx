"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyOperation, PropertyType } from "@/types/property";

function PropiedadesContent() {
  const searchParams = useSearchParams();
  const operation = searchParams.get("operation") as PropertyOperation | null;
  const type = searchParams.get("type") as PropertyType | null;
  const location = searchParams.get("location");

  const { data, isLoading, isError } = useProperties({
    operation: operation ?? undefined,
    type: type ?? undefined,
    location: location ?? undefined,
    limit: 12,
    page: parseInt(searchParams.get("page") || "1", 10),
  });

  const properties = data?.properties ?? [];

  return (
    <main className="min-h-screen">
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Propiedades
          </h1>
          <p className="text-muted-foreground mb-8">
            {operation && (
              <span>
                {operation === "sell" ? "Venta" : "Alquiler"}
                {type && ` • ${type}`}
                {location && ` • ${location}`}
              </span>
            )}
            {!operation && !type && !location && "Todas las propiedades disponibles"}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-muted-foreground">
              No pudimos cargar las propiedades. Intentá de nuevo más tarde.
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay propiedades que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
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
          <div className="max-w-6xl mx-auto">
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
