import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMarkdown, generateQuesoMarkdown, generateCarneMarkdown } from "@/lib/markdown";

/**
 * GET /api/lista/download?store=ubereats|queso|carne
 * Generate and return .md file for a specific store.
 * Default: ubereats (backwards compatible)
 */
export async function GET(request: NextRequest) {
  try {
    const store = request.nextUrl.searchParams.get("store") || "ubereats";

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

    // Filter items by store
    const storeItems = list.items.filter((item) => item.product.store === store);

    if (store === "ubereats") {
      if (storeItems.length === 0 && list.customItems.length === 0) {
        return NextResponse.json(
          { error: "La lista de UberEats está vacía" },
          { status: 400 }
        );
      }
      const markdown = generateMarkdown(storeItems, list.customItems, list.createdAt);
      const dateStr = list.createdAt.toISOString().split("T")[0];
      const filename = `pedido-ubereats-${dateStr}.md`;

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    if (storeItems.length === 0) {
      const storeName = store === "queso" ? "Sr. del Queso" : "Carne (Vecino)";
      return NextResponse.json(
        { error: `La lista de ${storeName} está vacía` },
        { status: 400 }
      );
    }

    if (store === "queso") {
      const markdown = generateQuesoMarkdown(storeItems, list.createdAt);
      const dateStr = list.createdAt.toISOString().split("T")[0];
      const filename = `pedido-queso-${dateStr}.md`;

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    if (store === "carne") {
      const markdown = generateCarneMarkdown(storeItems, list.createdAt);
      const dateStr = list.createdAt.toISOString().split("T")[0];
      const filename = `pedido-carne-${dateStr}.md`;

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(
      { error: "Store no válido. Usa: ubereats, queso, o carne" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GET /api/lista/download error:", error);
    return NextResponse.json(
      { error: "Error al generar archivo" },
      { status: 500 }
    );
  }
}
