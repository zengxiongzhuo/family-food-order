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
        toast.error(data.error || "提交订单失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[var(--background)]">
      <header className="sticky top-0 z-40 glass border-b border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">购物车</h1>
          {totalItems > 0 && (
            <span className="text-xs text-white bg-[var(--primary)] px-2 py-0.5 rounded-full font-medium">
              {totalItems} 道菜
            </span>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShoppingCart className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-sm font-medium">购物车是空的</p>
          <button
            onClick={() => router.push("/")}
            className="mt-5 px-6 py-2.5 text-sm font-medium text-white bg-[var(--primary)] rounded-full hover:bg-[var(--primary-dark)] transition-colors shadow-lg shadow-orange-200/50"
          >
            去点菜
          </button>
        </div>
      ) : (
        <div className="px-5 pb-28">
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {items.map((item) => (
              <CartItem key={item.dishId} item={item} />
            ))}
          </div>

          <div className="mt-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              📝 特殊要求
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="口味偏好、忌口等备注..."
            />
          </div>

          <div className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 p-4 z-20">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-[var(--primary)] py-3.5 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-orange-300/30"
            >
              {submitting ? "提交中..." : `提交订单（共 ${totalItems} 道）`}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
