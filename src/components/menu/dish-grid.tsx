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
        <div className="py-12 text-center text-gray-400">
          <span className="text-4xl block mb-2">🍽️</span>
          <p>暂无可点的菜品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-24">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
