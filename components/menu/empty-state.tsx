"use client";

import { Utensils, Search, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

interface EmptyStateProps {
  icon: "utensils" | "search" | "alert" | "plus";
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}

const icons = {
  utensils: Utensils,
  search: Search,
  alert: AlertCircle,
  plus: Plus,
};

export function EmptyState({ icon, title, description, action, onAction }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <Empty>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
        {action && onAction && (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4" />
            {action}
          </Button>
        )}
      </div>
    </Empty>
  );
}