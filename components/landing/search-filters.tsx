"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePropertyTypes } from "@/hooks/use-property-types";
import { useBarrios } from "@/hooks/use-barrios";
import type { PropertyOperation } from "@/types/property";

export function SearchFilters() {
  const router = useRouter();
  const { data: propertyTypes = [], isLoading } = usePropertyTypes();
  const { data: barrios = [], isLoading: isLoadingBarrios } = useBarrios();

  const [operation, setOperation] = React.useState<PropertyOperation>("sell");
  const [type, setType] = React.useState<string>("");
  const [location, setLocation] = React.useState("");
  const [typesOpen, setTypesOpen] = React.useState(false);
  const [locationOpen, setLocationOpen] = React.useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (operation) params.set("operation", operation);
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
          <Popover open={typesOpen} onOpenChange={setTypesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={typesOpen}
                disabled={isLoading}
                className="w-full justify-between font-normal h-9 px-3 py-2"
              >
                {isLoading
                  ? "Cargando tipos..."
                  : type
                    ? propertyTypes.find((t) => String(t.id) === type)?.name ??
                    "Tipo de propiedad"
                    : "Tipo de propiedad"}
                <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command
                filter={(value, search) => {
                  const q = search.trim().toLowerCase();
                  if (value === "__all__")
                    return !q || "todos los tipos".includes(q) ? 1 : 0;
                  if (!q) return 1;
                  return value.toLowerCase().includes(q) ? 1 : 0;
                }}
              >
                <CommandInput placeholder="Buscar tipo..." />
                <CommandList className="max-h-[240px]">
                  <CommandEmpty>No se encontró el tipo.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__all__"
                      onSelect={() => {
                        setType("");
                        setTypesOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4",
                          !type ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Todos los tipos
                    </CommandItem>
                    {propertyTypes.map((t) => (
                      <CommandItem
                        key={t.id}
                        value={t.name}
                        onSelect={() => {
                          setType(String(t.id));
                          setTypesOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4",
                            type === String(t.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {t.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationOpen}
                disabled={isLoadingBarrios}
                className="w-full justify-between font-normal h-9 px-3 py-2"
              >
                {isLoadingBarrios
                  ? "Cargando ubicaciones..."
                  : location
                    ? barrios.find((b) => String(b.id) === location)?.name ??
                    "Ubicación"
                    : "Ubicación"}
                <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command
                filter={(value, search) => {
                  const q = search.trim().toLowerCase();
                  if (!q) return 1;
                  return value.toLowerCase().includes(q) ? 1 : 0;
                }}
              >
                <CommandInput placeholder="Buscar barrio..." />
                <CommandList className="max-h-[240px]">
                  <CommandEmpty>No se encontró el barrio.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="__all__"
                      onSelect={() => {
                        setLocation("");
                        setLocationOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4",
                          !location ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Todos los barrios
                    </CommandItem>
                    {barrios.map((division) => (
                      <CommandItem
                        key={division.id}
                        value={division.name}
                        onSelect={() => {
                          setLocation(String(division.id));
                          setLocationOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4",
                            location === String(division.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {division.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleSearch} size="md" className="gap-2">
          <SearchIcon className="size-4" />
          Buscar
        </Button>
      </div>
    </div>
  );
}
