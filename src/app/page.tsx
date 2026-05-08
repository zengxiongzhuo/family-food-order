import { prisma } from "@/lib/prisma";
import { DishGrid } from "@/components/menu/dish-grid";
import { CartFab } from "@/components/cart/cart-fab";
import type { DishWithCategory } from "@/types";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [dishes, categories] = await Promise.all([
    prisma.dish.findMany({
      where: { isAvailable: true },
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <main className="flex-1">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">家庭菜单</h1>
          <p className="text-xs text-gray-500">选择今天想吃的菜</p>
        </div>
      </header>
      <DishGrid
        dishes={dishes as unknown as DishWithCategory[]}
        categories={categories}
      />
      <CartFab />
    </main>
  );
}
