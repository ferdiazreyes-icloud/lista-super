import { describe, it, expect } from "vitest";
import { generateMarkdown } from "../src/lib/markdown";

// Mock data matching Prisma types
const mockProduct = (overrides = {}) => ({
  id: 1,
  name: "Aguacate",
  category: "Frutas y Verduras",
  brand: null,
  ubereatsName: "Aguacate hass",
  defaultQty: 5,
  unit: "pza",
  notes: null,
  sortOrder: 1001,
  createdAt: new Date(),
  ...overrides,
});

const mockListItem = (overrides = {}) => ({
  id: 1,
  listId: 1,
  productId: 1,
  quantity: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct(),
  ...overrides,
});

const mockCustomItem = (overrides = {}) => ({
  id: 1,
  listId: 1,
  productName: "Algo especial",
  quantity: 2,
  unit: "pza",
  createdAt: new Date(),
  ...overrides,
});

describe("generateMarkdown", () => {
  it("should generate header with correct date", () => {
    const date = new Date("2026-03-01T12:00:00Z");
    const md = generateMarkdown([mockListItem()], [], date);

    expect(md).toContain("# Pedido Supermercado — 2026-03-01");
    expect(md).toContain("## Chedraui Selecto (UberEats)");
  });

  it("should group items by category", () => {
    const items = [
      mockListItem({
        id: 1,
        productId: 1,
        quantity: 5,
        product: mockProduct({ id: 1, name: "Aguacate", category: "Frutas y Verduras" }),
      }),
      mockListItem({
        id: 2,
        productId: 2,
        quantity: 1,
        product: mockProduct({
          id: 2,
          name: "Leche de vaca",
          category: "Lácteos y Huevo",
          brand: "Santa Clara",
          ubereatsName: "Leche semidescremada deslactosada (4 x 1 L)",
        }),
      }),
    ];

    const md = generateMarkdown(items, [], new Date());

    expect(md).toContain("### FRUTAS Y VERDURAS");
    expect(md).toContain("### LÁCTEOS Y HUEVO");
    expect(md).toContain("Aguacate hass");
    expect(md).toContain("Leche semidescremada deslactosada (4 x 1 L) Santa Clara");
  });

  it("should include custom items in a separate section", () => {
    const customItems = [
      mockCustomItem({ productName: "Galletas especiales", quantity: 3, unit: "paquete" }),
    ];

    const md = generateMarkdown([], customItems, new Date());

    expect(md).toContain("### OTROS (capturados a mano)");
    expect(md).toContain("Galletas especiales");
    expect(md).toContain("3 paquete");
  });

  it("should include total count at the bottom", () => {
    const items = [
      mockListItem({ id: 1, productId: 1 }),
      mockListItem({
        id: 2,
        productId: 2,
        product: mockProduct({ id: 2, name: "Plátano", ubereatsName: "Plátano de chiapas/tabasco" }),
      }),
    ];
    const customItems = [mockCustomItem()];

    const md = generateMarkdown(items, customItems, new Date());

    expect(md).toContain("**Total: 3 productos | Tienda: Chedraui Selecto (UberEats)**");
  });

  it("should append brand to ubereats name when brand is not already included", () => {
    const items = [
      mockListItem({
        product: mockProduct({
          brand: "Los Volcanes",
          ubereatsName: "Queso oaxaca (400 g)",
        }),
      }),
    ];

    const md = generateMarkdown(items, [], new Date());

    expect(md).toContain("Queso oaxaca (400 g) Los Volcanes");
  });

  it("should not duplicate brand when already in ubereats name", () => {
    const items = [
      mockListItem({
        product: mockProduct({
          brand: "Barilla",
          ubereatsName: "Pasta de sémola Barilla (200 g)",
        }),
      }),
    ];

    const md = generateMarkdown(items, [], new Date());

    // Should not have "Barilla" twice
    const line = md.split("\n").find((l) => l.includes("Pasta de sémola"));
    expect(line).toBeDefined();
    const barillaCounts = (line!.match(/Barilla/g) || []).length;
    expect(barillaCounts).toBe(1);
  });

  it("should generate valid markdown table format", () => {
    const items = [mockListItem()];
    const md = generateMarkdown(items, [], new Date());

    expect(md).toContain("| # | Buscar en UberEats | Qty |");
    expect(md).toContain("|---|---|---|");
    expect(md).toContain("| 1 | Aguacate hass | 5 |");
  });

  it("should handle empty lists", () => {
    const md = generateMarkdown([], [], new Date("2026-03-01"));

    expect(md).toContain("# Pedido Supermercado — 2026-03-01");
    expect(md).toContain("**Total: 0 productos");
  });
});
