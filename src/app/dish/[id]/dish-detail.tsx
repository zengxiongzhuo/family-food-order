"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { CartFab } from "@/components/cart/cart-fab";

interface DishDetailProps {
  dish: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    ingredients: string;
    cookingMethod: string | null;
    category: { id: string; name: string };
  };
}

export function DishDetail({ dish }: DishDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  let ingredients: string[] = [];
  try {
    ingredients = JSON.parse(dish.ingredients);
  } catch {
    ingredients = dish.ingredients.split(",").map((s) => s.trim());
  }

  const handleAdd = () => {
    addItem(
      {
        dishId: dish.id,
        name: dish.name,
        imageUrl: dish.imageUrl,
        ingredients: dish.ingredients,
      },
      quantity
    );
    router.back();
  };

  return (
    <main className="flex-1 bg-white">
      <div className="relative">
        {dish.imageUrl ? (
          <div className="relative aspect-[16/10] bg-gray-100">
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-b from-orange-100 to-orange-50 flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{dish.name}</h1>
            <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
              {dish.category.name}
            </span>
          </div>
          {dish.description && (
            <p className="text-sm text-gray-600">{dish.description}</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">所需食材</h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-200"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {dish.cookingMethod && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              做法
            </h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {dish.cookingMethod}
            </p>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors active:scale-[0.98]"
          >
            加入购物车
          </button>
        </div>
      </div>
      <CartFab />
    </main>
  );
}
