"use client";

import { useState } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { CheckIcon, ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePropertyTypes } from "@/hooks/use-property-types";
import { useBarrios } from "@/hooks/use-barrios";

function PriceFilterSection() {
  const [minPrice, setMinPrice] = useQueryState("min_price", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("max_price", parseAsInteger);
  
  // Use URL params as initial values, key forces reset when URL changes
  const [minPriceInput, setMinPriceInput] = useState(
    () => minPrice?.toString() ?? ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    () => maxPrice?.toString() ?? ""
  );

  const handleApply = () => {
    const min = minPriceInput.trim() ? parseInt(minPriceInput, 10) : null;
    const max = maxPriceInput.trim() ? parseInt(maxPriceInput, 10) : null;
    setMinPrice(min && min > 0 ? min : null);
    setMaxPrice(max && max > 0 ? max : null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Mín"
          value={minPriceInput}
          onChange={(e) => setMinPriceInput(e.target.value)}
          onKeyDown={handleKeyDown}
          min={0}
          className="flex-1"
        />
        <Input
          type="number"
          inputMode="numeric"
          placeholder="Máx"
          value={maxPriceInput}
          onChange={(e) => setMaxPriceInput(e.target.value)}
          onKeyDown={handleKeyDown}
          min={0}
          className="flex-1"
        />
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={handleApply}
      >
        Aplicar precio
      </Button>
    </>
  );
}

export function PropertyFiltersSidebar() {
  const { data: propertyTypes = [], isLoading: isLoadingTypes } = usePropertyTypes();
  const { data: barrios = [], isLoading: isLoadingBarrios } = useBarrios();

  const [typesOpen, setTypesOpen] = useState(false);
  const [barriosOpen, setBarriosOpen] = useState(false);

  const [operation, setOperation] = useQueryState(
    "operation",
    parseAsString.withDefault("")
  );
  const [location, setLocation] = useQueryState(
    "location",
    parseAsString.withDefault("")
  );
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("")
  );
  const [minPrice, setMinPrice] = useQueryState("min_price", parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState("max_price", parseAsInteger);

  const handleOperationChange = (value: string) => {
    setOperation(value || null);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value || null);
  };

  const handleTypeChange = (value: string) => {
    setType(value || null);
  };

  const clearFilters = () => {
    setOperation(null);
    setLocation(null);
    setType(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const hasActiveFilters =
    operation ||
    location ||
    type ||
    minPrice !== null ||
    maxPrice !== null;

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-24 rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontalIcon className="size-5 text-primary" />
          <h2 className="font-semibold text-lg">Filtros</h2>
        </div>

        <div className="space-y-5">
          {/* Operación: Venta / Alquiler */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Operación
            </Label>
            <Select
              value={operation || "all"}
              onValueChange={(v) =>
                handleOperationChange(v === "all" ? "" : v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="sell">Venta</SelectItem>
                <SelectItem value="rent">Alquiler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de propiedad */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Tipo de propiedad
            </Label>
            <Popover open={typesOpen} onOpenChange={setTypesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={typesOpen}
                  disabled={isLoadingTypes}
                  className="w-full justify-between font-normal h-9 px-3 py-2"
                >
                  {isLoadingTypes
                    ? "Cargando..."
                    : type
                      ? propertyTypes.find((t) => String(t.id) === type)?.name ??
                        "Todos los tipos"
                      : "Todos los tipos"}
                  <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
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
                          handleTypeChange("");
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
                            handleTypeChange(String(t.id));
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

          {/* Barrio (Capital Federal) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Barrio
            </Label>
            <Popover open={barriosOpen} onOpenChange={setBarriosOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={barriosOpen}
                  disabled={isLoadingBarrios}
                  className="w-full justify-between font-normal h-9 px-3 py-2"
                >
                  {isLoadingBarrios
                    ? "Cargando..."
                    : location
                      ? barrios.find((b) => String(b.id) === location)?.name ??
                        "Todos los barrios"
                      : "Todos los barrios"}
                  <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command
                  filter={(value, search) => {
                    const q = search.trim().toLowerCase();
                    if (value === "__all__")
                      return !q || "todos los barrios".includes(q) ? 1 : 0;
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
                          handleLocationChange("");
                          setBarriosOpen(false);
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
                            handleLocationChange(String(division.id));
                            setBarriosOpen(false);
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

          {/* Rango de precio */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Rango de precio
            </Label>
            <PriceFilterSection key={`${minPrice ?? ""}-${maxPrice ?? ""}`} />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
