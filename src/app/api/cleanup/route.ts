import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-off cleanup endpoint. Delete this route after running once in production.
// Idempotent: running it multiple times returns count=0 from the second call onward.
const DISCONTINUED = [
  { store: "queso", name: "Feta" },
  { store: "queso", name: "Betabel con quinoa" },
];

export async function GET() {
  try {
    const results: { store: string; name: string; deleted: number }[] = [];
    for (const item of DISCONTINUED) {
      const r = await prisma.product.deleteMany({
        where: { store: item.store, name: item.name },
      });
      results.push({ ...item, deleted: r.count });
    }
    const total = results.reduce((sum, r) => sum + r.deleted, 0);
    return NextResponse.json({
      message: `Cleanup completado. ${total} productos eliminados.`,
      results,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Error al eliminar productos", details: String(error) },
      { status: 500 }
    );
  }
}
