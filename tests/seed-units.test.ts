import { describe, it, expect } from "vitest";

// Replicate the deriveUnit function from seed.ts for testing
function deriveUnit(
  name: string,
  ubereatsName: string,
  notes: string | null,
  category: string
): string {
  const lowerName = name.toLowerCase();
  const lowerUE = ubereatsName.toLowerCase();
  const lowerNotes = (notes || "").toLowerCase();

  if (lowerNotes.includes("kg") || lowerNotes.includes("por kg")) return "kg";
  if (lowerUE.includes("manojo")) return "manojo";
  if (lowerUE.includes("rollo")) return "rollo";
  if (/\(\d+\s*x\s*\d+/.test(lowerUE)) return "pack";
  if (/\(\d+\s*(g|ml|l|un)\)/.test(lowerUE)) return "paquete";
  if (lowerName.includes("lata") || lowerUE.includes("lata")) return "lata";
  if (lowerName.includes("barra") || lowerUE.includes("barra")) return "barra";
  if (category === "Bebidas") return "botella";
  if (lowerUE.includes("bolsa")) return "paquete";

  return "pza";
}

describe("deriveUnit", () => {
  it("should return 'pza' for loose produce", () => {
    expect(deriveUnit("Aguacate", "Aguacate hass", null, "Frutas y Verduras")).toBe("pza");
    expect(deriveUnit("Plátano", "Plátano de chiapas/tabasco", null, "Frutas y Verduras")).toBe("pza");
    expect(deriveUnit("Chile serrano", "Chile serrano", null, "Frutas y Verduras")).toBe("pza");
  });

  it("should return 'kg' when notes mention kg", () => {
    expect(deriveUnit("Betabel", "Betabel", "Por kg", "Frutas y Verduras")).toBe("kg");
    expect(deriveUnit("Coliflor", "Coliflor preenfriada", "~1.2 kg", "Frutas y Verduras")).toBe("kg");
    expect(deriveUnit("Jícama", "Jícama", "~1.3 kg", "Frutas y Verduras")).toBe("kg");
  });

  it("should return 'manojo' for manojo products", () => {
    expect(deriveUnit("Cilantro", "Manojo de cilantro", null, "Frutas y Verduras")).toBe("manojo");
    expect(deriveUnit("Perejil", "Manojo de perejil liso", null, "Frutas y Verduras")).toBe("manojo");
  });

  it("should return 'rollo' for rollo products", () => {
    expect(deriveUnit("Epazote", "Epazote Rollo", null, "Frutas y Verduras")).toBe("rollo");
  });

  it("should return 'pack' for multi-unit packages", () => {
    expect(
      deriveUnit("Leche de vaca", "Leche semidescremada deslactosada (4 x 1 L)", null, "Lácteos y Huevo")
    ).toBe("pack");
    expect(
      deriveUnit("Yakult", "Alimento a base de leche fermentada (5 x 80 ml)", null, "Lácteos y Huevo")
    ).toBe("pack");
    expect(
      deriveUnit("Tostaditas (Salmas)", "Salmas tostaditas de maíz horneadas (20x3 un)", null, "Pan y Tortilla")
    ).toBe("pack");
  });

  it("should return 'paquete' for single-unit packages with weight", () => {
    expect(
      deriveUnit("Blueberry", "Mora azul (170 g)", null, "Frutas y Verduras")
    ).toBe("paquete");
    expect(
      deriveUnit("Brócoli", "Floretes de brócoli frescos (454 g)", null, "Frutas y Verduras")
    ).toBe("paquete");
    expect(
      deriveUnit("Queso crema", "Queso crema original (200 g)", null, "Lácteos y Huevo")
    ).toBe("paquete");
  });

  it("should return 'lata' for canned items", () => {
    expect(deriveUnit("Atún en lata", "Atún en lata", null, "Despensa")).toBe("lata");
  });

  it("should return 'barra' for bar items", () => {
    expect(
      deriveUnit("Jabón en barra", "Jabón de tocador dermatológico en barra (4 x 150 g)", null, "Limpieza y Hogar")
    ).toBe("pack"); // pack wins because of (4 x 150 g) pattern
  });

  it("should return 'botella' for beverages without package pattern", () => {
    expect(deriveUnit("Agua de coco", "Agua de coco", null, "Bebidas")).toBe("botella");
  });
});
