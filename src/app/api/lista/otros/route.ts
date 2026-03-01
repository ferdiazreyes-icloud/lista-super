import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/lista/otros — Add custom item
 *
 * Body: { productName: string, quantity?: number, unit?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, quantity = 1, unit = "pza" } = body;

    if (!productName || productName.trim() === "") {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }

    const list = await prisma.list.findFirst({
      where: { status: "active" },
    });

    if (!list) {
      return NextResponse.json(
        { error: "No hay lista activa" },
        { status: 404 }
      );
    }

    const item = await prisma.listCustomItem.create({
      data: {
        listId: list.id,
        productName: productName.trim(),
        quantity,
        unit,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("POST /api/lista/otros error:", error);
    return NextResponse.json(
      { error: "Error al agregar producto" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lista/otros — Remove custom item
 *
 * Body: { id: number }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.listCustomItem.delete({ where: { id } });

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("DELETE /api/lista/otros error:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
