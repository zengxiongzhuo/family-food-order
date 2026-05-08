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
      <div className="flex gap-2 px-5 py-4 min-w-max">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm",
            activeId === null
              ? "bg-[var(--primary)] text-white shadow-md shadow-orange-200"
              : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-100"
          )}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm",
              activeId === cat.id
                ? "bg-[var(--primary)] text-white shadow-md shadow-orange-200"
                : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-100"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
