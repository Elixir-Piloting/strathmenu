"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type CartItem = { id: string };

async function fetchCart(): Promise<string[]> {
  try {
    const res = await fetch("/api/cart");
    if (!res.ok) return [];
    const items: CartItem[] = await res.json();
    return items.map((i) => i.id);
  } catch {
    return [];
  }
}

export function useCart() {
  const qc = useQueryClient();
  const key = ["cart"];

  const { data: ids = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: fetchCart,
    staleTime: 0,
  });

  const add = useMutation({
    mutationFn: (menuItemId: string) =>
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId }),
      }),
    onMutate: async (menuItemId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key);
      qc.setQueryData<string[]>(key, (old) => [...new Set([...(old || []), menuItemId])]);
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  const remove = useMutation({
    mutationFn: (menuItemId: string) =>
      fetch(`/api/cart?menuItemId=${menuItemId}`, { method: "DELETE" }),
    onMutate: async (menuItemId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key);
      qc.setQueryData<string[]>(key, (old) => (old || []).filter((i) => i !== menuItemId));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  const clearMutation = useMutation({
    mutationFn: () => fetch("/api/cart", { method: "DELETE" }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key);
      qc.setQueryData<string[]>(key, []);
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    ids,
    count: ids.length,
    isLoading,
    add: add.mutate,
    remove: remove.mutate,
    toggle: (id: string) => {
      if (ids.includes(id)) remove.mutate(id);
      else add.mutate(id);
    },
    clear: clearMutation.mutate,
  };
}
