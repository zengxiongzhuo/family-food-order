"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import type { DishWithCategory } from "@/types";

interface DishCardProps {
  dish: DishWithCategory;
}

export function DishCard({ dish }: DishCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      dishId: dish.id,
      name: dish.name,
      imageUrl: dish.imageUrl,
      ingredients: dish.ingredients,
    });
  };

  return (
    <Link
      href={`/dish/${dish.id}`}
      className="card-hover block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50"
    >
      <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-amber-50">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {/* 加入购物车按钮 */}
        <button
          onClick={handleAdd}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg shadow-orange-300/40 hover:bg-[var(--primary-dark)] transition-all active:scale-90"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
      <div className="p-2.5">
        <h3 className="font-semibold text-sm text-gray-800 truncate leading-tight">
          {dish.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
          {dish.category.name}
        </p>
      </div>
    </Link>
  );
}
