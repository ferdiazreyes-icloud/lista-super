import { Product, ListItem, ListCustomItem } from "@prisma/client";

interface ItemWithProduct extends ListItem {
  product: Product;
}

/**
 * Generate a markdown file for the grocery order,
 * matching the format of pedido-esta-semana.md
 */
export function generateMarkdown(
  items: ItemWithProduct[],
  customItems: ListCustomItem[],
  listDate: Date
): string {
  const dateStr = listDate.toISOString().split("T")[0];
  const lines: string[] = [];

  lines.push("# Pedido Supermercado — " + dateStr);
  lines.push("## Chedraui Selecto (UberEats)");
  lines.push("");

  // Group items by category
  const grouped = new Map<string, ItemWithProduct[]>();
  for (const item of items) {
    const cat = item.product.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  // Category display order
  const categoryOrder = [
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

  let counter = 1;

  for (const category of categoryOrder) {
    const catItems = grouped.get(category);
    if (!catItems || catItems.length === 0) continue;

    // Map category to display name
    const displayName = getCategoryDisplayName(category);
    lines.push(`### ${displayName}`);
    lines.push("");
    lines.push("| # | Buscar en UberEats | Qty |");
    lines.push("|---|---|---|");

    for (const item of catItems) {
      const p = item.product;
      const searchName = buildSearchName(p);
      lines.push(`| ${counter} | ${searchName} | ${item.quantity} |`);
      counter++;
    }

    lines.push("");
  }

  // Custom items (Otros from free text)
  if (customItems.length > 0) {
    lines.push("### OTROS (capturados a mano)");
    lines.push("");
    lines.push("| # | Producto | Qty |");
    lines.push("|---|---|---|");

    for (const ci of customItems) {
      lines.push(
        `| ${counter} | ${ci.productName} | ${ci.quantity} ${ci.unit} |`
      );
      counter++;
    }

    lines.push("");
  }

  lines.push("---");
  lines.push(
    `**Total: ${counter - 1} productos | Tienda: Chedraui Selecto (UberEats)**`
  );

  return lines.join("\n");
}

function getCategoryDisplayName(category: string): string {
  const map: Record<string, string> = {
    "Frutas y Verduras": "FRUTAS Y VERDURAS",
    "Lácteos y Huevo": "LÁCTEOS Y HUEVO",
    "Pan y Tortilla": "PAN Y TORTILLA",
    "Carnes Frías": "CARNES FRÍAS",
    Despensa: "DESPENSA",
    Congelados: "CONGELADOS",
    Bebidas: "BEBIDAS",
    "Frutos Secos": "FRUTOS SECOS / CHILES SECOS",
    Otros: "OTROS",
    "Limpieza y Hogar": "LIMPIEZA Y HOGAR",
    "Cuidado Personal": "CUIDADO PERSONAL",
  };
  return map[category] || category.toUpperCase();
}

/**
 * Build the search name for UberEats, including brand if present
 */
function buildSearchName(product: Product): string {
  let name = product.ubereatsName;
  if (product.brand) {
    // If brand is not already in the ubereats name, append it
    if (!name.toLowerCase().includes(product.brand.toLowerCase())) {
      name = `${name} ${product.brand}`;
    }
  }
  return name;
}
