"use client";

import type { MenuItemWithCategory } from "@/hooks/use-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditItemDialog } from "./edit-item-dialog";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItemCardProps {
  item: MenuItemWithCategory;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden">
      {item.imageUrl && (
        <div className="aspect-video w-full bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{item.name}</h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {item.category.name}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">KSh {item.price.toFixed(2)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EditItemDialog
                  item={item}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {item.day && <Badge variant="outline">{item.day}</Badge>}
          {item.mealPeriod && <Badge variant="outline">{item.mealPeriod}</Badge>}
          {item.location && <Badge variant="outline">{item.location}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}