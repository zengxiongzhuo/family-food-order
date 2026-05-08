"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
}

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  size = "md",
}: QuantityControlProps) {
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-sm w-6" : "text-base w-8";

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDecrement}
        className={cn(
          btnSize,
          "flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn(textSize, "text-center font-medium")}>{quantity}</span>
      <button
        onClick={onIncrement}
        className={cn(
          btnSize,
          "flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
