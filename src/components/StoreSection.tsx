"use client";

import { ProductWithSelection } from "@/lib/types";
import StoreProductCard from "./StoreProductCard";

interface StoreSectionProps {
  storeTitle: string;
  storeEmoji: string;
  categoryOrder: string[];
  products: ProductWithSelection[];
  onToggle: (productId: number, selected: boolean, quantity: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

const STORE_CATEGORY_EMOJIS: Record<string, string> = {
  // Sr. del Queso
  "Quesos": "🧀",
  "Tortillas y Maíz": "🌽",
  "Cocina Libanesa": "🧆",
  "Pollo": "🍗",
  "Salchichonería": "🌭",
  "Orgánicos": "🌿",
  // Carne Vecino
  "Res": "🥩",
  "Cerdo": "🐷",
  // "Pollo" is shared
};

/**
 * Section for a non-UberEats store (Sr. del Queso, Carne Vecino).
 * Groups products by subcategory within the store.
 */
export default function StoreSection({
  storeTitle,
  storeEmoji,
  categoryOrder,
  products,
  onToggle,
  onQuantityChange,
}: StoreSectionProps) {
  // Group products by category
  const grouped = new Map<string, ProductWithSelection[]>();
  for (const p of products) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }

  const selectedCount = products.filter((p) => p.selected).length;

  return (
    <div className="mt-6">
      {/* Store header */}
      <div className="mx-3 mb-3 rounded-xl bg-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">
            {storeEmoji} {storeTitle}
          </h2>
          {selectedCount > 0 && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              {selectedCount}
            </span>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {categoryOrder.map((category) => {
        const catProducts = grouped.get(category);
        if (!catProducts || catProducts.length === 0) return null;
        const emoji = STORE_CATEGORY_EMOJIS[category] || "📋";
        const catSelectedCount = catProducts.filter((p) => p.selected).length;

        return (
          <section key={category}>
            <div className="category-header">
              <span className="mr-1">{emoji}</span>
              {category}
              {catSelectedCount > 0 && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  {catSelectedCount}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 px-3 pb-4">
              {catProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  onToggle={onToggle}
                  onQuantityChange={onQuantityChange}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
