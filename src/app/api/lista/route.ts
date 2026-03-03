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

    // Get all products grouped by store
    const allProducts = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
    });

    // Build a map of selected product IDs to quantities
    const selections = new Map(
      list.items.map((item) => [item.productId, item.quantity])
    );

    const mapProduct = (p: typeof allProducts[0]) => ({
      ...p,
      selected: selections.has(p.id),
      quantity: selections.get(p.id) ?? (p.defaultQty > 0 ? p.defaultQty : 1),
    });

    // Split products by store
    const ubereatsProducts = allProducts.filter((p) => p.store === "ubereats").map(mapProduct);
    const quesoProducts = allProducts.filter((p) => p.store === "queso").map(mapProduct);
    const carneProducts = allProducts.filter((p) => p.store === "carne").map(mapProduct);

    return NextResponse.json({
      list: {
        id: list.id,
        name: list.name,
        status: list.status,
        createdAt: list.createdAt,
      },
      products: ubereatsProducts,
      quesoProducts,
      carneProducts,
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
