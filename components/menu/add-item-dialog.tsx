"use client";

import { useState, useEffect } from "react";
import { useCreateMenuItem, useCategories, useLocations } from "@/hooks/use-menu";
import { toast } from "sonner";
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
import { Plus, Loader2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_PERIODS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

interface AddItemDialogProps {
  trigger?: React.ReactNode;
}

export function AddItemDialog({ trigger }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [day, setDay] = useState("");
  const [mealPeriod, setMealPeriod] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [openCategory, setOpenCategory] = useState(false);
  const [openDay, setOpenDay] = useState(false);
  const [openMeal, setOpenMeal] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  const { data: categories } = useCategories(categorySearch);
  const { data: locations } = useLocations();
  const createItem = useCreateMenuItem();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) return;

    createItem.mutate(
      {
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
          toast.success("Menu item added!");
          setOpen(false);
          resetForm();
        },
        onError: () => {
          toast.error("Failed to add menu item");
        },
      }
    );
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setCategoryId(null);
    setDay("");
    setMealPeriod("");
    setLocation("");
    setImageUrl("");
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-1">
      <div className="grid gap-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Chicken Wrap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={createItem.isPending} className="w-full">
        {createItem.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Add Item
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Menu Item</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pb-8">
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
          <DialogTitle>Add Menu Item</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}