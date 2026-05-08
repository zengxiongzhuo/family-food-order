import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validators";
import { sendOrderEmail } from "@/lib/email";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { select: { id: true, dishName: true, quantity: true, ingredients: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, notes } = createOrderSchema.parse(body);

    // Fetch dish details for each item
    const dishIds = items.map((item) => item.dishId);
    const dishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    const dishMap = new Map(dishes.map((d) => [d.id, d]));

    // Validate all dishes exist
    for (const item of items) {
      if (!dishMap.has(item.dishId)) {
        return NextResponse.json(
          { error: `Dish not found: ${item.dishId}` },
          { status: 400 }
        );
      }
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        notes: notes || null,
        totalItems,
        items: {
          create: items.map((item) => {
            const dish = dishMap.get(item.dishId)!;
            return {
              dishId: item.dishId,
              dishName: dish.name,
              quantity: item.quantity,
              ingredients: dish.ingredients,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    // Send email notification
    const emailSent = await sendOrderEmail({
      items: order.items.map((item) => ({
        dishName: item.dishName,
        quantity: item.quantity,
        ingredients: item.ingredients,
      })),
      notes: order.notes,
      orderTime: order.createdAt,
    });

    // Update order status if email sent
    if (emailSent) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "EMAIL_SENT", emailSentAt: new Date() },
      });
    }

    return NextResponse.json(
      { ...order, status: emailSent ? "EMAIL_SENT" : "PENDING" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
