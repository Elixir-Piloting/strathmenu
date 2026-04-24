import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, Category } from "@prisma/client";

export type MenuItemWithCategory = MenuItem & { category: Category };

type FilterParams = {
  category?: string;
  day?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
};

export function useMenuItems(filters: FilterParams = {}) {
  const queryString = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString();

  return useQuery({
    queryKey: ["menu-items", filters],
    queryFn: async () => {
      const res = await fetch(`/api/menu-items${queryString ? `?${queryString}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return res.json() as Promise<MenuItemWithCategory[]>;
    },
  });
}

export function useMenuItemCount() {
  return useQuery({
    queryKey: ["menu-item-count"],
    queryFn: async () => {
      const res = await fetch("/api/menu-items");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const items = (await res.json()) as MenuItemWithCategory[];
      return items.length;
    },
    staleTime: 30 * 1000,
  });
}

export function useCategories(searchQuery: string) {
  return useQuery({
    queryKey: ["categories", searchQuery],
    queryFn: async () => {
      const res = await fetch(
        `/api/categories${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json() as Promise<Category[]>;
    },
    staleTime: 30 * 1000,
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    staleTime: Infinity,
  });
}

type CreateItemInput = {
  name: string;
  price: number;
  categoryId?: string;
  categoryName: string;
  day?: string;
  mealPeriod?: string;
  location?: string;
  imageUrl?: string;
};

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const res = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create menu item");
      return res.json() as Promise<MenuItemWithCategory>;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["menu-items"] });

      const tempId = `temp-${Date.now()}`;
      const previousItems = queryClient.getQueryData<MenuItemWithCategory[]>(["menu-items", {}]);

      queryClient.setQueryData<MenuItemWithCategory[]>(["menu-items", {}], (old) => {
        if (!old) return old;
        return [
          {
            id: tempId,
            name: newItem.name,
            price: newItem.price,
            categoryId: newItem.categoryId || tempId,
            day: newItem.day || null,
            mealPeriod: newItem.mealPeriod || null,
            location: newItem.location || null,
            imageUrl: newItem.imageUrl || null,
            createdAt: new Date(),
            category: { id: tempId, name: newItem.categoryName },
          },
          ...old,
        ];
      });

      return { previousItems, tempId };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["menu-items", {}], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

type UpdateItemInput = CreateItemInput & { id: string };

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateItemInput) => {
      const res = await fetch("/api/menu-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update menu item");
      return res.json() as Promise<MenuItemWithCategory>;
    },
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ["menu-items"] });
      const previousItems = queryClient.getQueryData<MenuItemWithCategory[]>(["menu-items", {}]);

      queryClient.setQueryData<MenuItemWithCategory[]>(["menu-items", {}], (old) => {
        if (!old) return old;
        return old.map((item) =>
          item.id === updatedItem.id
            ? {
                ...item,
                name: updatedItem.name,
                price: updatedItem.price,
                day: updatedItem.day || null,
                mealPeriod: updatedItem.mealPeriod || null,
                location: updatedItem.location || null,
                imageUrl: updatedItem.imageUrl || null,
                category: { id: item.categoryId, name: updatedItem.categoryName },
              }
            : item
        );
      });

      return { previousItems };
    },
    onError: (_err, _updatedItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["menu-items", {}], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/menu-items?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete menu item");
      return res.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["menu-items"] });
      const previousItems = queryClient.getQueryData<MenuItemWithCategory[]>(["menu-items", {}]);

      queryClient.setQueryData<MenuItemWithCategory[]>(["menu-items", {}], (old) => {
        if (!old) return old;
        return old.filter((item) => item.id !== id);
      });

      return { previousItems };
    },
    onError: (_err, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["menu-items", {}], context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}