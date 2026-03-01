"use client";

import { ProductWithSelection } from "@/lib/types";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  category: string;
  products: ProductWithSelection[];
  onToggle: (productId: number, selected: boolean, quantity: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

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

export default function CategorySection({
  category,
  products,
  onToggle,
  onQuantityChange,
}: CategorySectionProps) {
  const selectedCount = products.filter((p) => p.selected).length;
  const emoji = CATEGORY_EMOJIS[category] || "📋";

  return (
    <section>
      <div className="category-header">
        <span className="mr-1">{emoji}</span>
        {category}
        {selectedCount > 0 && (
          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            {selectedCount}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-3 pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggle={onToggle}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </section>
  );
}
