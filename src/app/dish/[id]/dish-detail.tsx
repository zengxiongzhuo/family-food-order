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
    <main className="flex-1 bg-[var(--background)]">
      <div className="relative">
        {dish.imageUrl ? (
          <div className="relative aspect-[4/3] bg-gray-100">
            <Image
              src={dish.imageUrl}
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
            <span className="text-7xl">🍽️</span>
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-4 h-10 w-10 flex items-center justify-center rounded-full glass shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* 内容区 - 圆角覆盖图片底部 */}
      <div className="-mt-6 relative z-10 bg-[var(--background)] rounded-t-3xl px-5 pt-6 pb-28 space-y-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{dish.name}</h1>
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-orange-100 text-[var(--primary)] font-medium">
              {dish.category.name}
            </span>
          </div>
          {dish.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-2">{dish.description}</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-2.5">🥬 所需食材</h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs rounded-full bg-amber-50 text-amber-800 border border-amber-100 font-medium"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {dish.cookingMethod && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2.5">👨‍🍳 做法</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-white rounded-xl p-4 border border-gray-100">
              {dish.cookingMethod}
            </p>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 p-4 flex items-center gap-4 z-20">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--primary)] text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 rounded-full bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] transition-colors active:scale-[0.97] shadow-lg shadow-orange-300/30"
        >
          加入购物车
        </button>
      </div>
      <CartFab />
    </main>
  );
}
