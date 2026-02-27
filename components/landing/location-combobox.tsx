"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationCombobox({
  value,
  onValueChange,
  placeholder = "Buscar ubicación...",
  className,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [locations, setLocations] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchLocations = React.useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const res = await fetch(`/api/locations${params}`);
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => fetchLocations(query), 200);
    return () => clearTimeout(timer);
  }, [query, fetchLocations]);

  React.useEffect(() => {
    if (open && locations.length === 0) fetchLocations("");
  }, [open, fetchLocations]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal min-w-[200px]",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value || placeholder}
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Buscando..." : "No se encontraron ubicaciones."}
            </CommandEmpty>
            <CommandGroup>
              {locations.map((loc) => (
                <CommandItem
                  key={loc}
                  value={loc}
                  onSelect={() => {
                    onValueChange?.(loc);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 size-4",
                      value === loc ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {loc}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
