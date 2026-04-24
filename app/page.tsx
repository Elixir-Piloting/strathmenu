"use client";

import { useState } from "react";
import { MenuItemList } from "@/components/menu/menu-item-list";
import { FilterBar } from "@/components/menu/filter-bar";
import { AddItemDialog } from "@/components/menu/add-item-dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FilterState {
  category: string;
  day: string;
  location: string;
}

export default function MenuPage() {
  const [filters, setFilters] = useState<FilterState>({ category: "", day: "", location: "" });
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col flex-1 relative">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">StrathMenu</h1>
                <p className="text-sm text-muted-foreground">Student-powered cafeteria menu</p>
              </div>
              <AddItemDialog
                trigger={
                  <Button className="hidden sm:flex">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <FilterBar filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <MenuItemList filters={filters} searchQuery={search} />
      </main>

      <AddItemDialog
        trigger={
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:hidden"
          >
            <Plus className="h-6 w-6" />
          </Button>
        }
      />

      <footer className="border-t py-4">
        <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          Made by students, for students
        </div>
      </footer>
    </div>
  );
}