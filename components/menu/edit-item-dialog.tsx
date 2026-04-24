"use client";

import { useState, useEffect } from "react";
import { useCategories, useLocations, useUpdateMenuItem } from "@/hooks/use-menu";
import { toast } from "sonner";
import type { MenuItemWithCategory } from "@/hooks/use-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Pencil, Loader2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_PERIODS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

interface EditItemDialogProps {
  item: MenuItemWithCategory;
  trigger?: React.ReactNode;
}

export function EditItemDialog({ item, trigger }: EditItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [categorySearch, setCategorySearch] = useState("");
  const [category, setCategory] = useState(item.category.name);
  const [categoryId, setCategoryId] = useState<string | null>(item.categoryId);
  const [day, setDay] = useState(item.day || "");
  const [mealPeriod, setMealPeriod] = useState(item.mealPeriod || "");
  const [location, setLocation] = useState(item.location || "");
  const [imageUrl, setImageUrl] = useState(item.imageUrl || "");

  const [openCategory, setOpenCategory] = useState(false);
  const [openDay, setOpenDay] = useState(false);
  const [openMeal, setOpenMeal] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  const { data: categories } = useCategories(categorySearch);
  const { data: locations } = useLocations();
  const updateItem = useUpdateMenuItem();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (open) {
      setName(item.name);
      setPrice(item.price.toString());
      setCategory(item.category.name);
      setCategoryId(item.categoryId);
      setDay(item.day || "");
      setMealPeriod(item.mealPeriod || "");
      setLocation(item.location || "");
      setImageUrl(item.imageUrl || "");
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) return;

    updateItem.mutate(
      {
        id: item.id,
        name: name.trim(),
        price: parseFloat(price),
        categoryName: category,
        categoryId: categoryId || undefined,
        day: day || undefined,
        mealPeriod: mealPeriod || undefined,
        location: location || undefined,
        imageUrl: imageUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Menu item updated!");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update menu item");
        },
      }
    );
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-1">
      <div className="grid gap-2">
        <Label htmlFor="edit-name">Name *</Label>
        <Input
          id="edit-name"
          placeholder="e.g., Chicken Wrap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="edit-price">Price *</Label>
        <Input
          id="edit-price"
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g., 150"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Category *</Label>
        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
            >
              {category || "Select or create category"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search categories..."
                value={categorySearch}
                onValueChange={setCategorySearch}
              />
              <CommandEmpty>No category found. Press Enter to create.</CommandEmpty>
              <CommandGroup className="max-h-48 overflow-auto">
                {categories?.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.name}
                    onSelect={() => {
                      setCategory(cat.name);
                      setCategoryId(cat.id);
                      setOpenCategory(false);
                      setCategorySearch("");
                    }}
                  >
                    {cat.name}
                  </CommandItem>
                ))}
                {categorySearch &&
                  !categories?.some((c) => c.name.toLowerCase() === categorySearch.toLowerCase()) && (
                    <CommandItem
                      value={categorySearch}
                      onSelect={() => {
                        setCategory(categorySearch);
                        setCategoryId(null);
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Day</Label>
          <Popover open={openDay} onOpenChange={setOpenDay}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {day || "Any"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <Command>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setDay("");
                      setOpenDay(false);
                    }}
                  >
                    Any
                  </CommandItem>
                  {DAYS.map((d) => (
                    <CommandItem
                      key={d}
                      value={d}
                      onSelect={() => {
                        setDay(d);
                        setOpenDay(false);
                      }}
                    >
                      {d}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label>Meal</Label>
          <Popover open={openMeal} onOpenChange={setOpenMeal}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {mealPeriod || "Any"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <Command>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setMealPeriod("");
                      setOpenMeal(false);
                    }}
                  >
                    Any
                  </CommandItem>
                  {MEAL_PERIODS.map((m) => (
                    <CommandItem
                      key={m}
                      value={m}
                      onSelect={() => {
                        setMealPeriod(m);
                        setOpenMeal(false);
                      }}
                    >
                      {m}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Location</Label>
        <Popover open={openLocation} onOpenChange={setOpenLocation}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {location || "Any location"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandEmpty>No location found</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setLocation("");
                    setOpenLocation(false);
                  }}
                >
                  Any location
                </CommandItem>
                {locations?.map((loc: { id: string; name: string }) => (
                  <CommandItem
                    key={loc.id}
                    value={loc.name}
                    onSelect={() => {
                      setLocation(loc.name);
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
      </div>

      <div className="grid gap-2">
        <Label htmlFor="edit-image">Image URL</Label>
        <Input
          id="edit-image"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={updateItem.isPending} className="w-full">
        {updateItem.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>Edit Menu Item</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pb-8 px-4">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}