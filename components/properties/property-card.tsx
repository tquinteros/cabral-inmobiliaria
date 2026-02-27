"use client";

import Image from "next/image";
import Link from "next/link";
import { BedIcon, BathIcon, SquareIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyAmenities } from "./property-amenities";
import type { TokkoProperty } from "@/types/property";

interface PropertyCardProps {
  property: TokkoProperty;
}

function formatPrice(price?: string, operations?: string[]) {
  if (price && price !== "Consultar" && !price.toLowerCase().includes("consultar")) {
    return price;
  }
  return "Consultar precio";
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl =
    property.cover_picture?.url ??
    property.cover_picture?.thumb ??
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

  const operation = property.available_operations?.[0];
  const isRent = operation?.toLowerCase().includes("rent") ?? false;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow pt-0">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={property.type?.name ?? "Propiedad"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {isRent ? "Alquiler" : "Venta"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {property.publication_title ??
              `${property.type?.name ?? "Propiedad"} en ${property.location?.short_location ?? "—"}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property.location?.short_location ?? "Sin ubicación"}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {property.room_amount != null && property.room_amount > 0 && (
            <span className="flex items-center gap-1">
              <BedIcon className="size-4" />
              {property.room_amount} amb.
            </span>
          )}
          {property.bathroom_amount != null && property.bathroom_amount > 0 && (
            <span className="flex items-center gap-1">
              <BathIcon className="size-4" />
              {property.bathroom_amount} baños
            </span>
          )}
          {(property.surface ?? property.roofed_surface) != null &&
            (property.surface ?? property.roofed_surface)! > 0 && (
              <span className="flex items-center gap-1">
                <SquareIcon className="size-4" />
                {property.surface ?? property.roofed_surface} m²
              </span>
            )}
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <PropertyAmenities amenities={property.amenities} />
        )}

        <p className="font-semibold text-primary">
          {formatPrice(property.web_price, property.available_operations)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/propiedades/${property.id}`}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
