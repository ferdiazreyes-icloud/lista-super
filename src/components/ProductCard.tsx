"use client";

import { ProductWithSelection } from "@/lib/types";
import { useCallback } from "react";

interface ProductCardProps {
  product: ProductWithSelection;
  onToggle: (productId: number, selected: boolean, quantity: number) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
}

export default function ProductCard({
  product,
  onToggle,
  onQuantityChange,
}: ProductCardProps) {
  const handleTap = useCallback(() => {
    if (!product.selected) {
      onToggle(product.id, true, product.defaultQty);
    } else {
      onToggle(product.id, false, product.defaultQty);
    }
  }, [product, onToggle]);

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newQty = product.quantity + 1;
      onQuantityChange(product.id, newQty);
    },
    [product, onQuantityChange]
  );

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (product.quantity > 1) {
        onQuantityChange(product.id, product.quantity - 1);
      } else {
        // Quantity = 0 means deselect
        onToggle(product.id, false, product.defaultQty);
      }
    },
    [product, onToggle, onQuantityChange]
  );

  return (
    <div
      className={`product-card cursor-pointer ${product.selected ? "selected" : ""}`}
      onClick={handleTap}
    >
      {/* Checkbox area */}
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
          product.selected
            ? "border-green-500 bg-green-500"
            : "border-gray-300"
        }`}
      >
        {product.selected && (
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Product info */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-tight ${product.selected ? "text-green-900" : "text-gray-800"}`}>
          {product.name}
        </p>
        {product.brand && (
          <p className="text-xs text-gray-400">{product.brand}</p>
        )}
      </div>

      {/* Quantity controls */}
      {product.selected ? (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button className="qty-btn selected" onClick={handleDecrement}>
            −
          </button>
          <span className="w-8 text-center text-sm font-bold text-green-800">
            {product.quantity}
          </span>
          <button className="qty-btn selected" onClick={handleIncrement}>
            +
          </button>
          <span className="text-xs text-green-600">{product.unit}</span>
        </div>
      ) : (
        <span className="text-xs text-gray-400">
          {product.defaultQty} {product.unit}
        </span>
      )}
    </div>
  );
}
