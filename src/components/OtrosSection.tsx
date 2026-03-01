"use client";

import { CustomItem } from "@/lib/types";
import { useState } from "react";

interface OtrosSectionProps {
  items: CustomItem[];
  onAdd: (productName: string, quantity: number, unit: string) => void;
  onRemove: (id: number) => void;
}

export default function OtrosSection({ items, onAdd, onRemove }: OtrosSectionProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pza");

  const handleAdd = () => {
    if (name.trim() === "") return;
    onAdd(name.trim(), parseInt(quantity) || 1, unit);
    setName("");
    setQuantity("1");
    setUnit("pza");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <section>
      <div className="category-header">
        <span className="mr-1">✍️</span>
        Otros (captura libre)
      </div>

      <div className="px-3 pb-4">
        {/* Existing custom items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-1.5 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2"
          >
            <span className="flex-1 text-sm font-medium text-blue-900">
              {item.productName}
            </span>
            <span className="text-sm text-blue-600">
              {item.quantity} {item.unit}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 active:bg-red-200"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add new custom item */}
        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 bg-white p-3">
          <input
            type="text"
            placeholder="Producto..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-20 rounded-md border border-gray-200 px-3 py-2 text-center text-sm focus:border-blue-400 focus:outline-none"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            >
              <option value="pza">pza</option>
              <option value="kg">kg</option>
              <option value="paquete">paquete</option>
              <option value="botella">botella</option>
              <option value="lata">lata</option>
              <option value="manojo">manojo</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={name.trim() === ""}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 active:bg-blue-600"
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
