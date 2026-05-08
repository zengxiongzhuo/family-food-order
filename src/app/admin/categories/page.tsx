import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">分类管理</h2>
      <CategoryForm categories={categories} />
    </div>
  );
}
