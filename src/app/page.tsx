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
    <main className="flex-1 pb-24">
      <header className="gradient-header text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">今天想吃什么？</h1>
        <p className="text-white/80 text-sm mt-1">选好菜品，一键下单通知厨师</p>
      </header>
      <div className="-mt-4 relative z-10">
        <DishGrid
          dishes={dishes as unknown as DishWithCategory[]}
          categories={categories}
        />
      </div>
      <CartFab />
    </main>
  );
}
