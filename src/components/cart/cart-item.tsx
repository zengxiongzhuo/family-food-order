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
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {(() => {
            try {
              return (JSON.parse(item.ingredients) as string[]).slice(0, 3).join("、");
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
        className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
