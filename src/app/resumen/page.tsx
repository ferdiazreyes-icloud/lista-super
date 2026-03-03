"use client";

import { useState, useEffect } from "react";
import { ListData, ProductWithSelection, CustomItem } from "@/lib/types";

const UBEREATS_CATEGORY_ORDER = [
  "Frutas y Verduras",
  "Lácteos y Huevo",
  "Pan y Tortilla",
  "Carnes Frías",
  "Despensa",
  "Congelados",
  "Bebidas",
  "Frutos Secos",
  "Otros",
  "Limpieza y Hogar",
  "Cuidado Personal",
];

const UBEREATS_CATEGORY_EMOJIS: Record<string, string> = {
  "Frutas y Verduras": "🥬",
  "Lácteos y Huevo": "🥛",
  "Pan y Tortilla": "🍞",
  "Carnes Frías": "🥓",
  "Despensa": "🫙",
  "Congelados": "🧊",
  "Bebidas": "🧃",
  "Frutos Secos": "🥜",
  "Otros": "📦",
  "Limpieza y Hogar": "🧹",
  "Cuidado Personal": "🧴",
};

const QUESO_CATEGORY_ORDER = [
  "Quesos",
  "Tortillas y Maíz",
  "Cocina Libanesa",
  "Pollo",
  "Salchichonería",
  "Orgánicos",
];

const QUESO_CATEGORY_EMOJIS: Record<string, string> = {
  "Quesos": "🧀",
  "Tortillas y Maíz": "🌽",
  "Cocina Libanesa": "🧆",
  "Pollo": "🍗",
  "Salchichonería": "🌭",
  "Orgánicos": "🌿",
};

const CARNE_CATEGORY_ORDER = ["Res", "Cerdo", "Pollo"];
const CARNE_CATEGORY_EMOJIS: Record<string, string> = {
  "Res": "🥩",
  "Cerdo": "🐷",
  "Pollo": "🍗",
};

function groupByCategory(products: ProductWithSelection[]): Map<string, ProductWithSelection[]> {
  const grouped = new Map<string, ProductWithSelection[]>();
  for (const p of products) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }
  return grouped;
}

function StoreSummarySection({
  title,
  emoji,
  categoryOrder,
  categoryEmojis,
  products,
  downloadStore,
  borderColor,
  bgColor,
  textColor,
}: {
  title: string;
  emoji: string;
  categoryOrder: string[];
  categoryEmojis: Record<string, string>;
  products: ProductWithSelection[];
  downloadStore: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}) {
  const grouped = groupByCategory(products);
  const count = products.length;

  if (count === 0) return null;

  return (
    <div className="mb-6">
      {/* Store header */}
      <div className={`mx-4 mb-3 rounded-xl ${bgColor} p-3`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold ${textColor}`}>
            {emoji} {title}
          </h2>
          <span className={`text-sm font-bold ${textColor}`}>{count} productos</span>
        </div>
      </div>

      {/* Categories */}
      {categoryOrder.map((category) => {
        const catProducts = grouped.get(category);
        if (!catProducts || catProducts.length === 0) return null;
        const catEmoji = categoryEmojis[category] || "📋";

        return (
          <section key={category} className="mb-3">
            <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {catEmoji} {category}
            </h3>
            <div className={`mx-4 overflow-hidden rounded-lg border ${borderColor}`}>
              <table className="w-full text-sm">
                <tbody>
                  {catProducts.map((p, i) => (
                    <tr
                      key={p.id}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {p.name}
                        {p.brand && (
                          <span className="ml-1 text-xs text-gray-400">
                            {p.brand}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-green-700">
                        {p.quantity}{" "}
                        <span className="font-normal text-gray-400">
                          {p.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {/* Download button for this store */}
      <div className="mx-4 mt-2">
        <a
          href={`/api/lista/download?store=${downloadStore}`}
          className={`action-btn block text-center ${
            downloadStore === "ubereats"
              ? "bg-green-600 active:bg-green-700"
              : downloadStore === "queso"
              ? "bg-yellow-600 active:bg-yellow-700"
              : "bg-red-600 active:bg-red-700"
          }`}
        >
          📥 Descargar .md — {title} ({count})
        </a>
      </div>
    </div>
  );
}

export default function ResumenPage() {
  const [ubereatsProducts, setUbereatsProducts] = useState<ProductWithSelection[]>([]);
  const [quesoProducts, setQuesoProducts] = useState<ProductWithSelection[]>([]);
  const [carneProducts, setCarneProducts] = useState<ProductWithSelection[]>([]);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/lista");
      if (!res.ok) throw new Error("Error");
      const data: ListData = await res.json();
      setUbereatsProducts(data.products.filter((p) => p.selected));
      setQuesoProducts(data.quesoProducts.filter((p) => p.selected));
      setCarneProducts(data.carneProducts.filter((p) => p.selected));
      setCustomItems(data.customItems);
      setListName(data.list.name || "Lista del Súper");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewList = async () => {
    if (!confirm("¿Crear nueva lista? La lista actual se archivará.")) return;
    setCreatingNew(true);
    try {
      const res = await fetch("/api/lista", { method: "POST" });
      if (!res.ok) throw new Error("Error");
      // Redirect to home page with fresh list
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setCreatingNew(false);
    }
  };

  const ubereatsCount = ubereatsProducts.length + customItems.length;
  const quesoCount = quesoProducts.length;
  const carneCount = carneProducts.length;
  const totalCount = ubereatsCount + quesoCount + carneCount;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">📋 Resumen</h1>
            <p className="text-xs text-gray-400">{listName}</p>
          </div>
          <a
            href="/"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 active:bg-gray-200"
          >
            ← Editar
          </a>
        </div>
      </header>

      {totalCount === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="mb-2 text-4xl">🛒</p>
          <p className="mb-1 text-lg font-semibold text-gray-700">Lista vacía</p>
          <p className="mb-6 text-sm text-gray-400">
            Aún no se ha seleccionado ningún producto
          </p>
          <a href="/" className="action-btn inline-block bg-green-600">
            Ir a la lista
          </a>
        </div>
      ) : (
        <main className="pt-2">
          {/* Total summary count */}
          <div className="mx-4 mb-4 rounded-xl bg-green-50 p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{totalCount}</p>
            <p className="text-sm text-green-600">productos en total</p>
            {(quesoCount > 0 || carneCount > 0) && (
              <p className="mt-1 text-xs text-green-500">
                {ubereatsCount > 0 && `UberEats: ${ubereatsCount}`}
                {ubereatsCount > 0 && quesoCount > 0 && " · "}
                {quesoCount > 0 && `Sr. Queso: ${quesoCount}`}
                {(ubereatsCount > 0 || quesoCount > 0) && carneCount > 0 && " · "}
                {carneCount > 0 && `Carne: ${carneCount}`}
              </p>
            )}
          </div>

          {/* UberEats section */}
          {ubereatsCount > 0 && (
            <StoreSummarySection
              title="Chedraui Selecto (UberEats)"
              emoji="🛒"
              categoryOrder={UBEREATS_CATEGORY_ORDER}
              categoryEmojis={UBEREATS_CATEGORY_EMOJIS}
              products={ubereatsProducts}
              downloadStore="ubereats"
              borderColor="border-gray-200"
              bgColor="bg-green-50"
              textColor="text-green-800"
            />
          )}

          {/* Custom items (only for UberEats) */}
          {customItems.length > 0 && (
            <section className="mb-6">
              <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                ✍️ Otros (captura libre)
              </h3>
              <div className="mx-4 overflow-hidden rounded-lg border border-blue-200">
                <table className="w-full text-sm">
                  <tbody>
                    {customItems.map((item, i) => (
                      <tr
                        key={item.id}
                        className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}
                      >
                        <td className="px-3 py-2 font-medium text-blue-900">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-blue-700">
                          {item.quantity}{" "}
                          <span className="font-normal text-blue-400">
                            {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Sr. del Queso section */}
          {quesoCount > 0 && (
            <StoreSummarySection
              title="Sr. del Queso"
              emoji="🧀"
              categoryOrder={QUESO_CATEGORY_ORDER}
              categoryEmojis={QUESO_CATEGORY_EMOJIS}
              products={quesoProducts}
              downloadStore="queso"
              borderColor="border-yellow-200"
              bgColor="bg-yellow-50"
              textColor="text-yellow-800"
            />
          )}

          {/* Carne (Vecino) section */}
          {carneCount > 0 && (
            <StoreSummarySection
              title="Carne (Vecino)"
              emoji="🥩"
              categoryOrder={CARNE_CATEGORY_ORDER}
              categoryEmojis={CARNE_CATEGORY_EMOJIS}
              products={carneProducts}
              downloadStore="carne"
              borderColor="border-red-200"
              bgColor="bg-red-50"
              textColor="text-red-800"
            />
          )}
        </main>
      )}

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-3 shadow-lg">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <button
            onClick={handleNewList}
            disabled={creatingNew}
            className="action-btn bg-orange-500 active:bg-orange-600 disabled:opacity-50"
          >
            {creatingNew ? "Creando..." : "🔄 Nueva lista"}
          </button>
        </div>
      </div>
    </div>
  );
}
