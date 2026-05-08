"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-3 min-w-max">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            activeId === null
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeId === cat.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
