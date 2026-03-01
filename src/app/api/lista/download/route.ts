import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMarkdown } from "@/lib/markdown";

/**
 * GET /api/lista/download — Generate and return .md file
 */
export async function GET() {
  try {
    const list = await prisma.list.findFirst({
      where: { status: "active" },
      include: {
        items: {
          include: { product: true },
          orderBy: { product: { sortOrder: "asc" } },
        },
        customItems: true,
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: "No hay lista activa" },
        { status: 404 }
      );
    }

    if (list.items.length === 0 && list.customItems.length === 0) {
      return NextResponse.json(
        { error: "La lista está vacía" },
        { status: 400 }
      );
    }

    const markdown = generateMarkdown(
      list.items,
      list.customItems,
      list.createdAt
    );
    const dateStr = list.createdAt.toISOString().split("T")[0];
    const filename = `pedido-${dateStr}.md`;

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/lista/download error:", error);
    return NextResponse.json(
      { error: "Error al generar archivo" },
      { status: 500 }
    );
  }
}
