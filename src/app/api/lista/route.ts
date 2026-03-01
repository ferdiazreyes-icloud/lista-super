import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/lista — Get active list with all products and selections
 */
export async function GET() {
  try {
    // Get or create active list
    let list = await prisma.list.findFirst({
      where: { status: "active" },
      include: {
        items: { include: { product: true } },
        customItems: true,
      },
    });

    if (!list) {
      list = await prisma.list.create({
        data: {
          name: `Semana ${new Date().toISOString().split("T")[0]}`,
          status: "active",
        },
        include: {
          items: { include: { product: true } },
          customItems: true,
        },
      });
    }

    // Get all products
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // Build a map of selected product IDs to quantities
    const selections = new Map(
      list.items.map((item) => [item.productId, item.quantity])
    );

    return NextResponse.json({
      list: {
        id: list.id,
        name: list.name,
        status: list.status,
        createdAt: list.createdAt,
      },
      products: products.map((p) => ({
        ...p,
        selected: selections.has(p.id),
        quantity: selections.get(p.id) ?? p.defaultQty,
      })),
      customItems: list.customItems,
    });
  } catch (error) {
    console.error("GET /api/lista error:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lista — Create new list (closes previous)
 */
export async function POST() {
  try {
    // Close any active lists
    await prisma.list.updateMany({
      where: { status: "active" },
      data: { status: "closed", closedAt: new Date() },
    });

    // Create new active list
    const list = await prisma.list.create({
      data: {
        name: `Semana ${new Date().toISOString().split("T")[0]}`,
        status: "active",
      },
    });

    return NextResponse.json({ list });
  } catch (error) {
    console.error("POST /api/lista error:", error);
    return NextResponse.json(
      { error: "Error al crear nueva lista" },
      { status: 500 }
    );
  }
}
