"use client";

import { useState, useEffect } from "react";
import { ListData, ProductWithSelection, CustomItem } from "@/lib/types";

const CATEGORY_ORDER = [
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

const CATEGORY_EMOJIS: Record<string, string> = {
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

export default function ResumenPage() {
  const [products, setProducts] = useState<ProductWithSelection[]>([]);
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
      setProducts(data.products.filter((p) => p.selected));
      setCustomItems(data.customItems);
      setListName(data.list.name || "Lista del Súper");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.location.href = "/api/lista/download";
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

  // Group selected products by category
  const grouped = new Map<string, ProductWithSelection[]>();
  for (const p of products) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }

  const totalCount = products.length + customItems.length;

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
          {/* Summary count */}
          <div className="mx-4 mb-4 rounded-xl bg-green-50 p-4 text-center">
            <p className="text-3xl font-bold text-green-700">{totalCount}</p>
            <p className="text-sm text-green-600">productos en el pedido</p>
          </div>

          {/* Category groups */}
          {CATEGORY_ORDER.map((category) => {
            const catProducts = grouped.get(category);
            if (!catProducts || catProducts.length === 0) return null;
            const emoji = CATEGORY_EMOJIS[category] || "📋";

            return (
              <section key={category} className="mb-4">
                <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {emoji} {category}
                </h3>
                <div className="mx-4 overflow-hidden rounded-lg border border-gray-200">
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

          {/* Custom items */}
          {customItems.length > 0 && (
            <section className="mb-4">
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
        </main>
      )}

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-3 shadow-lg">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {totalCount > 0 && (
            <button
              onClick={handleDownload}
              className="action-btn bg-green-600 active:bg-green-700"
            >
              📥 Descargar .md ({totalCount} productos)
            </button>
          )}
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
