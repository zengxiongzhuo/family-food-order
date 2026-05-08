"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Dish {
  id: string;
  name: string;
  imageUrl: string | null;
  isAvailable: boolean;
  category: { id: string; name: string };
}

export function DishListClient({ dishes: initialDishes }: { dishes: Dish[] }) {
  const [dishes, setDishes] = useState(initialDishes);
  const router = useRouter();

  const handleToggle = async (id: string, isAvailable: boolean) => {
    const res = await fetch(`/api/dishes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
    if (res.ok) {
      setDishes(dishes.map((d) => (d.id === id ? { ...d, isAvailable: !isAvailable } : d)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这道菜吗？")) return;
    const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDishes(dishes.filter((d) => d.id !== id));
      router.refresh();
    }
  };

  if (dishes.length === 0) {
    return <p className="text-center text-gray-400 py-8">暂无菜品，添加第一道菜吧！</p>;
  }

  return (
    <div className="space-y-2">
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200"
        >
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {dish.imageUrl ? (
              <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex items-center justify-center h-full text-lg">🍽️</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
            <p className="text-xs text-gray-500">{dish.category.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggle(dish.id, dish.isAvailable)}
              className={`p-1.5 rounded transition-colors ${
                dish.isAvailable ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
              }`}
              title={dish.isAvailable ? "已上架" : "已隐藏"}
            >
              {dish.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <Link
              href={`/admin/dishes/${dish.id}/edit`}
              className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(dish.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
