import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DishDetail } from "./dish-detail";

export const dynamic = "force-dynamic";

export default async function DishDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!dish) notFound();

  return <DishDetail dish={dish} />;
}
