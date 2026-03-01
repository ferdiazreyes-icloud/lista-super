import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/lista/items — Toggle/update product selection
 *
 * Body: { productId: number, quantity?: number, selected: boolean }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, selected } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Get active list
    const list = await prisma.list.findFirst({
      where: { status: "active" },
    });

    if (!list) {
      return NextResponse.json(
        { error: "No hay lista activa" },
        { status: 404 }
      );
    }

    if (selected) {
      // Get product default qty if no quantity provided
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }

      const qty = quantity ?? product.defaultQty;

      // Upsert: create or update selection
      const item = await prisma.listItem.upsert({
        where: {
          listId_productId: {
            listId: list.id,
            productId,
          },
        },
        update: { quantity: qty },
        create: {
          listId: list.id,
          productId,
          quantity: qty,
        },
        include: { product: true },
      });

      return NextResponse.json({ item });
    } else {
      // Deselect: remove from list
      await prisma.listItem
        .delete({
          where: {
            listId_productId: {
              listId: list.id,
              productId,
            },
          },
        })
        .catch(() => {
          // Item might not exist, that's OK
        });

      return NextResponse.json({ removed: true });
    }
  } catch (error) {
    console.error("PUT /api/lista/items error:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}
