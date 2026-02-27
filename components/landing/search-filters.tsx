"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { LocationCombobox } from "./location-combobox";
import { usePropertyTypes } from "@/hooks/use-property-types";
import type { PropertyOperation } from "@/types/property";

export function SearchFilters() {
  const router = useRouter();
  const { data: propertyTypes = [], isLoading } = usePropertyTypes();
  const [operation, setOperation] = React.useState<PropertyOperation>("sell");
  const [type, setType] = React.useState<string>("");
  const [location, setLocation] = React.useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("operation", operation);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4 p-4 sm:p-6 bg-background/95 backdrop-blur-sm rounded-xl border shadow-lg">
        <Tabs
          value={operation}
          onValueChange={(v) => setOperation(v as PropertyOperation)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="sell">Venta</TabsTrigger>
            <TabsTrigger value="rent">Alquiler</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 min-w-[160px]">
          <Select
            value={type}
            onValueChange={(v) => setType(v ?? "")}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Cargando..." : "Tipo de propiedad"} />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <LocationCombobox
            value={location}
            onValueChange={setLocation}
            placeholder="Ubicación"
          />
        </div>

        <Button onClick={handleSearch} size="lg" className="gap-2">
          <SearchIcon className="size-4" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
