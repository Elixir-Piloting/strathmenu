"use client";

import { useState } from "react";
import { useCategories, useLocations } from "@/hooks/use-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { X, Filter } from "lucide-react";

interface FilterState {
  category: string;
  day: string;
  location: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const { data: categories } = useCategories(categorySearch);
  const { data: locations } = useLocations();

  const activeFiltersCount = [filters.category, filters.day, filters.location].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({ category: "", day: "", location: "" });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Popover open={openCategory} onOpenChange={setOpenCategory}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-full">
            Category
            {filters.category && (
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                {filters.category}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={categorySearch}
              onValueChange={setCategorySearch}
            />
            <CommandEmpty>No category found</CommandEmpty>
            <CommandGroup className="max-h-48 overflow-auto">
              {categories?.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={() => {
                    onFiltersChange({ ...filters, category: cat.name });
                    setOpenCategory(false);
                  }}
                >
                  {cat.name}
                </CommandItem>
              ))}
              {categorySearch && !categories?.some(c => c.name.toLowerCase() === categorySearch.toLowerCase()) && (
                <CommandItem
                  value={categorySearch}
                  onSelect={() => {
                    onFiltersChange({ ...filters, category: categorySearch });
                    setOpenCategory(false);
                    setCategorySearch("");
                  }}
                >
                  Create &quot;{categorySearch}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openLocation} onOpenChange={setOpenLocation}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-full">
            Location
            {filters.location && (
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                {filters.location}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandEmpty>No location found</CommandEmpty>
            <CommandGroup>
              {locations?.map((loc: { id: string; name: string }) => (
                <CommandItem
                  key={loc.id}
                  value={loc.name}
                  onSelect={() => {
                    onFiltersChange({ ...filters, location: loc.name });
                    setOpenLocation(false);
                  }}
                >
                  {loc.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-full">
            Day
            {filters.day && (
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                {filters.day}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandEmpty>No day found</CommandEmpty>
            <CommandGroup>
              {DAYS.map((day) => (
                <CommandItem
                  key={day}
                  value={day}
                  onSelect={() => {
                    onFiltersChange({ ...filters, day });
                  }}
                >
                  {day}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-muted-foreground rounded-full"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}