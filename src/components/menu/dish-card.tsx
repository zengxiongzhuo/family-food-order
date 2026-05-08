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
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{dish.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {dish.category.name}
            </p>
            {dish.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                {dish.description}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
