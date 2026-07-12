"use client";

import { useState, useEffect } from "react";
import { useMenuItems } from "@/hooks/use-menu";
import { ShoppingCart, ArrowLeft, CopySimple, Check } from "@/components/ui/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSkeleton } from "@/components/cart/cart-skeleton";
import { toast } from "sonner";

export default function SharedCartPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { data: allItems, isLoading } = useMenuItems({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIds(params.get("items")?.split(",").filter(Boolean) || []);
  }, []);

  // ponytail: read-only shared view, minimal page
  const items = allItems?.filter((i) => ids.includes(i.id)) || [];
  const total = items.reduce((s, i) => s + i.price, 0);

  const copyText = () => {
    const lines = items.map(
      (i) =>
        `${i.name} — KSh ${i.price.toFixed(2)}${i.day ? ` (${i.day}` : ""}${i.mealPeriod ? `, ${i.mealPeriod}` : ""}${i.location ? `, At ${i.location})` : i.day || i.mealPeriod ? ")" : ""}`
    );
    lines.push("", `Total: KSh ${total.toFixed(2)}`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Shared Cart</h1>
      </div>

      {isLoading ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No items found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl border"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-primary">
                      KSh {item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    {item.day && <span>{item.day}</span>}
                    {item.mealPeriod && <span>{item.mealPeriod}</span>}
                    {item.location && <span>At {item.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t py-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={copyText} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <CopySimple className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy as text"}
            </Button>
            <span className="text-lg font-bold">Total: KSh {total.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}
