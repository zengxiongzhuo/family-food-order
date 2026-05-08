import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDishSchema } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dish = await prisma.dish.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }
    return NextResponse.json(dish);
  } catch (error) {
    console.error("Failed to fetch dish:", error);
    return NextResponse.json(
      { error: "Failed to fetch dish" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateDishSchema.parse(body);

    const dish = await prisma.dish.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(dish);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }
    console.error("Failed to update dish:", error);
    return NextResponse.json(
      { error: "Failed to update dish" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.dish.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }
    console.error("Failed to delete dish:", error);
    return NextResponse.json(
      { error: "Failed to delete dish" },
      { status: 500 }
    );
  }
}
