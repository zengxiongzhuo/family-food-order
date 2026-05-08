"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartFab() {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors active:scale-95"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold">
        {totalItems}
      </span>
    </Link>
  );
}
