"use client";

import { Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { QuantityControl } from "./quantity-control";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {(() => {
            try {
              return (JSON.parse(item.ingredients) as string[]).join(", ");
            } catch {
              return item.ingredients;
            }
          })()}
        </p>
      </div>
      <QuantityControl
        quantity={item.quantity}
        onIncrement={() => updateQuantity(item.dishId, item.quantity + 1)}
        onDecrement={() => updateQuantity(item.dishId, item.quantity - 1)}
        size="sm"
      />
      <button
        onClick={() => removeItem(item.dishId)}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
