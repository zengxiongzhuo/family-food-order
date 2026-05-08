import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { DishListClient } from "./dish-list-client";

export const dynamic = "force-dynamic";

export default async function DishesPage() {
  const dishes = await prisma.dish.findMany({
    include: { category: { select: { id: true, name: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Dish Management</h2>
        <Link
          href="/admin/dishes/new"
          className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Dish
        </Link>
      </div>
      <DishListClient dishes={dishes} />
    </div>
  );
}
