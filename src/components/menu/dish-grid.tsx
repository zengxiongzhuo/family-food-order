"use client";

import { useState } from "react";
import { CategoryTabs } from "./category-tabs";
import { DishCard } from "./dish-card";
import type { DishWithCategory } from "@/types";

interface DishGridProps {
  dishes: DishWithCategory[];
  categories: { id: string; name: string }[];
}

export function DishGrid({ dishes, categories }: DishGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredDishes = activeCategory
    ? dishes.filter((d) => d.categoryId === activeCategory)
    : dishes;

  return (
    <div>
      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />
      {filteredDishes.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <span className="text-5xl block mb-3">🍽️</span>
          <p className="text-sm">暂无可点的菜品</p>
          <p className="text-xs mt-1 text-gray-300">管理员可在后台添加菜品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
