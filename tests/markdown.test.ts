import { describe, it, expect } from "vitest";
import { generateMarkdown, generateQuesoMarkdown, generateCarneMarkdown } from "../src/lib/markdown";

// Mock data matching Prisma types
const mockProduct = (overrides = {}) => ({
  id: 1,
  name: "Aguacate",
  category: "Frutas y Verduras",
  store: "ubereats",
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

describe("generateQuesoMarkdown", () => {
  const mockQuesoProduct = (overrides = {}) =>
    mockProduct({
      store: "queso",
      ubereatsName: "",
      defaultQty: 0,
      ...overrides,
    });

  it("should generate header with Sr. del Queso title", () => {
    const date = new Date("2026-03-01T12:00:00Z");
    const items = [
      mockListItem({
        product: mockQuesoProduct({ name: "Oaxaca", category: "Quesos", unit: "kg" }),
        quantity: 1,
      }),
    ];
    const md = generateQuesoMarkdown(items, date);

    expect(md).toContain("# Pedido Sr. del Queso — 2026-03-01");
  });

  it("should group items by queso categories", () => {
    const items = [
      mockListItem({
        id: 1,
        productId: 1,
        quantity: 1,
        product: mockQuesoProduct({ id: 1, name: "Oaxaca", category: "Quesos", unit: "kg" }),
      }),
      mockListItem({
        id: 2,
        productId: 2,
        quantity: 2,
        product: mockQuesoProduct({ id: 2, name: "Totopos", category: "Tortillas y Maíz", unit: "paq" }),
      }),
      mockListItem({
        id: 3,
        productId: 3,
        quantity: 1,
        product: mockQuesoProduct({ id: 3, name: "Hummus", category: "Cocina Libanesa", unit: "pza" }),
      }),
    ];

    const md = generateQuesoMarkdown(items, new Date());

    expect(md).toContain("### QUESOS");
    expect(md).toContain("### TORTILLAS Y MAÍZ");
    expect(md).toContain("### COCINA LIBANESA");
    expect(md).toContain("| 1 | Oaxaca | 1 kg |");
    expect(md).toContain("| 2 | Totopos | 2 paq |");
    expect(md).toContain("| 3 | Hummus | 1 pza |");
  });

  it("should include total count for Sr. del Queso", () => {
    const items = [
      mockListItem({
        id: 1,
        productId: 1,
        quantity: 1,
        product: mockQuesoProduct({ id: 1, name: "Panela", category: "Quesos", unit: "kg" }),
      }),
      mockListItem({
        id: 2,
        productId: 2,
        quantity: 3,
        product: mockQuesoProduct({ id: 2, name: "Pan árabe", category: "Cocina Libanesa", unit: "paq" }),
      }),
    ];

    const md = generateQuesoMarkdown(items, new Date());

    expect(md).toContain("**Total: 2 productos | Tienda: Sr. del Queso**");
  });

  it("should use simple Producto/Cantidad table format", () => {
    const items = [
      mockListItem({
        product: mockQuesoProduct({ name: "Manchego", category: "Quesos", unit: "kg" }),
        quantity: 1,
      }),
    ];
    const md = generateQuesoMarkdown(items, new Date());

    expect(md).toContain("| # | Producto | Cantidad |");
    expect(md).toContain("|---|---|---|");
  });

  it("should handle empty queso list", () => {
    const md = generateQuesoMarkdown([], new Date("2026-03-01"));
    expect(md).toContain("# Pedido Sr. del Queso — 2026-03-01");
    expect(md).toContain("**Total: 0 productos | Tienda: Sr. del Queso**");
  });
});

describe("generateCarneMarkdown", () => {
  const mockCarneProduct = (overrides = {}) =>
    mockProduct({
      store: "carne",
      ubereatsName: "",
      defaultQty: 0,
      unit: "kg",
      ...overrides,
    });

  it("should generate header with Carne (Vecino) title", () => {
    const date = new Date("2026-03-01T12:00:00Z");
    const items = [
      mockListItem({
        product: mockCarneProduct({ name: "Arrachera", category: "Res" }),
        quantity: 2,
      }),
    ];
    const md = generateCarneMarkdown(items, date);

    expect(md).toContain("# Pedido Carne (Vecino) — 2026-03-01");
  });

  it("should group items by carne categories", () => {
    const items = [
      mockListItem({
        id: 1,
        productId: 1,
        quantity: 2,
        product: mockCarneProduct({ id: 1, name: "Arrachera", category: "Res" }),
      }),
      mockListItem({
        id: 2,
        productId: 2,
        quantity: 1,
        product: mockCarneProduct({ id: 2, name: "Chicharrón delgado", category: "Cerdo" }),
      }),
      mockListItem({
        id: 3,
        productId: 3,
        quantity: 1,
        product: mockCarneProduct({ id: 3, name: "Pechuga sin hueso", category: "Pollo" }),
      }),
    ];

    const md = generateCarneMarkdown(items, new Date());

    expect(md).toContain("### RES");
    expect(md).toContain("### CERDO");
    expect(md).toContain("### POLLO");
    expect(md).toContain("| 1 | Arrachera | 2 kg |");
    expect(md).toContain("| 2 | Chicharrón delgado | 1 kg |");
    expect(md).toContain("| 3 | Pechuga sin hueso | 1 kg |");
  });

  it("should include total count for Carne (Vecino)", () => {
    const items = [
      mockListItem({
        id: 1,
        productId: 1,
        quantity: 2,
        product: mockCarneProduct({ id: 1, name: "Rib Eye", category: "Res" }),
      }),
    ];

    const md = generateCarneMarkdown(items, new Date());

    expect(md).toContain("**Total: 1 productos | Tienda: Carne (Vecino)**");
  });

  it("should handle empty carne list", () => {
    const md = generateCarneMarkdown([], new Date("2026-03-01"));
    expect(md).toContain("# Pedido Carne (Vecino) — 2026-03-01");
    expect(md).toContain("**Total: 0 productos | Tienda: Carne (Vecino)**");
  });
});
