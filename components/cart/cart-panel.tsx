"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useMenuItems } from "@/hooks/use-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash,
  ShareNetwork,
} from "@/components/ui/icons";
import { toast } from "sonner";
import { CartSkeleton } from "./cart-skeleton";

function CartContent({ close }: { close?: () => void }) {
  const cart = useCart();
  const { data: items, isLoading } = useMenuItems({});
  const cartItems = items?.filter((i) => cart.ids.includes(i.id)) || [];
  const total = cartItems.reduce((s, i) => s + i.price, 0);

  const share = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/cart?items=${cart.ids.join(",")}`
    );
    toast.success("Cart link copied!");
  };

  if (cart.isLoading || isLoading) return <CartSkeleton />;

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
        <p>Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-primary">
                  KSh {item.price.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground">
                {item.day && <span>{item.day}</span>}
                {item.mealPeriod && <span>{item.mealPeriod}</span>}
                {item.location && <span>At {item.location}</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => cart.remove(item.id)}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="border-t p-4 space-y-3">
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>KSh {total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={share}>
            <ShareNetwork className="h-3.5 w-3.5" /> Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => {
              cart.clear();
              close?.();
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

function useIsMobile() {
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return mobile;
}

export function CartPanel() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const cart = useCart();

  const trigger = (
    <Button
      variant="outline"
      size="icon"
      className="relative rounded-full h-10 w-10"
      onClick={() => setOpen(true)}
    >
      <ShoppingCart className="h-4 w-4" />
      {cart.count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cart.count}
        </span>
      )}
    </Button>
  );

  return (
    <>
      {trigger}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Your Cart ({cart.count})</DrawerTitle>
            </DrawerHeader>
            <CartContent close={() => setOpen(false)} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Cart ({cart.count})</SheetTitle>
            </SheetHeader>
            <CartContent close={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
