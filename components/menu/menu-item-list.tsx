"use client";

import { useMenuItems } from "@/hooks/use-menu";
import { MenuItemCard } from "./menu-item-card";
import { MenuItemSkeleton } from "./menu-item-skeleton";
import { EmptyState } from "./empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

type FilterParams = {
  category: string;
  day: string;
  location: string;
};

interface MenuItemListProps {
  filters: FilterParams;
  searchQuery: string;
}

export function MenuItemList({ filters, searchQuery }: MenuItemListProps) {
  const activeFilters = {
    category: filters.category || undefined,
    day: filters.day || undefined,
    location: filters.location || undefined,
  };

  const { data: items, isLoading, error } = useMenuItems(activeFilters);

  const visibleItems = items?.filter((item) =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <EmptyState
          icon="alert"
          title="Failed to load menu"
          description="Something went wrong. Please try again."
        />
      </div>
    );
  }

  if (!visibleItems?.length) {
    return (
      <EmptyState
        icon="search"
        title={searchQuery || Object.values(filters).some(Boolean) ? "No results" : "No menu items yet"}
        description={
          searchQuery || Object.values(filters).some(Boolean)
            ? "Try adjusting your search or filters"
            : "Be the first to add a menu item!"
        }
      />
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {visibleItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
}