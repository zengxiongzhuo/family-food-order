import { prisma } from "@/lib/prisma";
import { DishForm } from "@/components/admin/dish-form";

export const dynamic = "force-dynamic";

export default async function NewDishPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">添加新菜品</h2>
      <DishForm categories={categories} />
    </div>
  );
}
