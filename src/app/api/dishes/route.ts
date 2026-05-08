import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDishSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = { isAvailable: true };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const dishes = await prisma.dish.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Failed to fetch dishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createDishSchema.parse(body);

    const dish = await prisma.dish.create({
      data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(dish, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Failed to create dish:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 }
    );
  }
}
