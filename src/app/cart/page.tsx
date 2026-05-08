"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-provider";
import { CartItem } from "@/components/cart/cart-item";

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, clearCart } = useCart();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            dishId: item.dishId,
            quantity: item.quantity,
          })),
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push("/order-success");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit order");
      }
    } catch {
      toast.error("Network error, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Cart</h1>
          <span className="text-sm text-gray-500">({totalItems} items)</span>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ShoppingCart className="h-12 w-12 mb-3" />
          <p className="text-sm">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-sm text-orange-500 hover:text-orange-600"
          >
            Browse menu
          </button>
        </div>
      ) : (
        <div className="px-4">
          <div className="py-2">
            {items.map((item) => (
              <CartItem key={item.dishId} item={item} />
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Any special requests or dietary notes..."
            />
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-lg bg-orange-500 py-3 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-colors active:scale-[0.98]"
            >
              {submitting ? "Submitting..." : `Submit Order (${totalItems} items)`}
            </button>
          </div>
          <div className="h-20" /> {/* spacer for fixed button */}
        </div>
      )}
    </main>
  );
}
