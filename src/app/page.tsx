"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CategorySection from "@/components/CategorySection";
import OtrosSection from "@/components/OtrosSection";
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

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithSelection[]>([]);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer ref for API calls
  const debounceRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/lista");
      if (!res.ok) throw new Error("Error al cargar datos");
      const data: ListData = await res.json();
      setProducts(data.products);
      setCustomItems(data.customItems);
      setListName(data.list.name || "Lista del Súper");
      setError(null);
    } catch (err) {
      setError("No se pudo cargar la lista. Intenta recargar la página.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle product selection
  const handleToggle = useCallback(
    (productId: number, selected: boolean, quantity: number) => {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, selected, quantity: selected ? quantity : p.defaultQty } : p
        )
      );

      // API call
      fetch("/api/lista/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, selected, quantity }),
      }).catch((err) => {
        console.error("Error toggling product:", err);
        // Revert on error
        fetchData();
      });
    },
    []
  );

  // Update quantity (debounced API call)
  const handleQuantityChange = useCallback(
    (productId: number, quantity: number) => {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
      );

      // Debounce the API call
      const existing = debounceRef.current.get(productId);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(() => {
        fetch("/api/lista/items", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, selected: true, quantity }),
        }).catch((err) => {
          console.error("Error updating quantity:", err);
          fetchData();
        });
        debounceRef.current.delete(productId);
      }, 500);

      debounceRef.current.set(productId, timer);
    },
    []
  );

  // Add custom item
  const handleAddCustom = useCallback(
    async (productName: string, quantity: number, unit: string) => {
      try {
        const res = await fetch("/api/lista/otros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName, quantity, unit }),
        });
        if (!res.ok) throw new Error("Error");
        const data = await res.json();
        setCustomItems((prev) => [...prev, data.item]);
      } catch (err) {
        console.error("Error adding custom item:", err);
      }
    },
    []
  );

  // Remove custom item
  const handleRemoveCustom = useCallback(async (id: number) => {
    setCustomItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch("/api/lista/otros", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Error removing custom item:", err);
      fetchData();
    }
  }, []);

  // Count selected
  const selectedCount =
    products.filter((p) => p.selected).length + customItems.length;

  // Group products by category
  const grouped = new Map<string, ProductWithSelection[]>();
  for (const p of products) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
          <p className="text-sm text-gray-500">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="action-btn bg-blue-500"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🛒 Lista del Súper</h1>
            <p className="text-xs text-gray-400">{listName}</p>
          </div>
          {selectedCount > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
              {selectedCount} productos
            </span>
          )}
        </div>
      </header>

      {/* Product categories */}
      <main className="pt-2">
        {CATEGORY_ORDER.map((category) => {
          const catProducts = grouped.get(category);
          if (!catProducts || catProducts.length === 0) return null;
          return (
            <CategorySection
              key={category}
              category={category}
              products={catProducts}
              onToggle={handleToggle}
              onQuantityChange={handleQuantityChange}
            />
          );
        })}

        {/* Otros (free text) */}
        <OtrosSection
          items={customItems}
          onAdd={handleAddCustom}
          onRemove={handleRemoveCustom}
        />
      </main>

      {/* Bottom bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white p-3 shadow-lg">
          <div className="mx-auto flex max-w-lg gap-2">
            <a
              href="/resumen"
              className="action-btn flex-1 bg-green-600 active:bg-green-700"
            >
              Ver resumen ({selectedCount})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
