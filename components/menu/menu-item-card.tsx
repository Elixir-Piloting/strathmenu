"use client";

import { useState } from "react";
import type { MenuItemWithCategory } from "@/hooks/use-menu";
import { useDeleteMenuItem } from "@/hooks/use-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { EditItemDialog } from "./edit-item-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MenuItemCardProps {
  item: MenuItemWithCategory;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteItem = useDeleteMenuItem();

  const handleDelete = () => {
    deleteItem.mutate(item.id, {
      onSuccess: () => {
        toast.success("Menu item deleted");
        setDeleteOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete menu item");
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white dark:bg-white/5 dark:border-white/10 shadow-sm">
      {item.imageUrl && (
        <div className="aspect-video w-full bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{item.name}</h3>
            <span className="text-lg font-bold text-primary mt-1 block">KSh {item.price.toFixed(2)}</span>
            <Badge variant="secondary" className="mt-1.5 text-xs">
              {item.category.name}
            </Badge>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 p-1">
              <EditItemDialog
                item={item}
                trigger={
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-md">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 rounded-md text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          {item.day && <Badge variant="outline">{item.day}</Badge>}
          {item.mealPeriod && <Badge variant="outline">{item.mealPeriod}</Badge>}
          {item.location && <Badge variant="outline">{item.location}</Badge>}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{item.name}&quot; from the menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}