import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DishForm } from "@/components/admin/dish-form";

export const dynamic = "force-dynamic";

export default async function EditDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dish, categories] = await Promise.all([
    prisma.dish.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!dish) notFound();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Dish</h2>
      <DishForm
        categories={categories}
        initialData={{
          id: dish.id,
          name: dish.name,
          categoryId: dish.categoryId,
          description: dish.description || "",
          imageUrl: dish.imageUrl,
          ingredients: dish.ingredients,
          cookingMethod: dish.cookingMethod || "",
          isAvailable: dish.isAvailable,
        }}
      />
    </div>
  );
}
