import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

/**
 * Derive the unit of measure from the product name, UberEats name, and notes.
 *
 * Logic:
 * - If notes mention "kg" → "kg"
 * - If ubereats name has "manojo" → "manojo"
 * - If ubereats name has "rollo" → "rollo"
 * - If ubereats name has patterns like "(4 x 1 L)" or "(5 x 80 ml)" → "pack"
 * - If ubereats name has "(X g)" or "(X ml)" or "(X L)" or "(X un)" → "paquete"
 * - If category is "Bebidas" and no package pattern → "botella"
 * - If product name contains "lata" or ubereats contains "lata" → "lata"
 * - If product name contains "barra" → "barra"
 * - Default → "pza"
 */
function deriveUnit(
  name: string,
  ubereatsName: string,
  notes: string | null,
  category: string
): string {
  const lowerName = name.toLowerCase();
  const lowerUE = ubereatsName.toLowerCase();
  const lowerNotes = (notes || "").toLowerCase();

  // Check notes for kg
  if (lowerNotes.includes("kg") || lowerNotes.includes("por kg")) return "kg";

  // Manojo
  if (lowerUE.includes("manojo")) return "manojo";

  // Rollo
  if (lowerUE.includes("rollo")) return "rollo";

  // Multi-pack pattern: (4 x 1 L), (5 x 80 ml), (20x3 un)
  if (/\(\d+\s*x\s*\d+/.test(lowerUE)) return "pack";

  // Single package pattern: (500 g), (200 ml), (1 L), (22 un)
  if (/\(\d+\s*(g|ml|l|un)\)/.test(lowerUE)) return "paquete";

  // Lata
  if (lowerName.includes("lata") || lowerUE.includes("lata")) return "lata";

  // Barra
  if (lowerName.includes("barra") || lowerUE.includes("barra")) return "barra";

  // Bebidas without package → botella
  if (category === "Bebidas") return "botella";

  // Bolsas
  if (lowerUE.includes("bolsa")) return "paquete";

  return "pza";
}

interface ExcelRow {
  "Producto (Lista)": string;
  "Pasillo UberEats": string;
  "Marca UberEats"?: string;
  "Nombre exacto en UberEats": string;
  "Qty default"?: number;
  "Alternativas / Notas"?: string;
}

async function main() {
  // Find the Excel file
  const excelPath =
    process.argv[2] ||
    path.join(
      process.env.HOME || "~",
      "Library/Mobile Documents/com~apple~CloudDocs/0. pagos/Supermercado",
      "lista súper (UberEats).xlsx"
    );

  if (!fs.existsSync(excelPath)) {
    console.error(`Excel file not found at: ${excelPath}`);
    console.error("Usage: npm run seed [path-to-excel]");
    process.exit(1);
  }

  console.log(`Reading Excel from: ${excelPath}`);

  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets["Referencia UberEats"];
  if (!sheet) {
    console.error('Sheet "Referencia UberEats" not found in the Excel file.');
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
  console.log(`Found ${rows.length} products in Excel`);

  // Category sort order for display
  const categoryOrder: Record<string, number> = {
    "Frutas y Verduras": 1,
    "Lácteos y Huevo": 2,
    "Pan y Tortilla": 3,
    "Carnes Frías": 4,
    Despensa: 5,
    Congelados: 6,
    Bebidas: 7,
    "Frutos Secos": 8,
    Otros: 9,
    "Limpieza y Hogar": 10,
    "Cuidado Personal": 11,
  };

  // Clear existing products
  console.log("Clearing existing products...");
  await prisma.listItem.deleteMany();
  await prisma.product.deleteMany();

  // Insert products
  let sortOrder = 0;
  for (const row of rows) {
    const name = row["Producto (Lista)"];
    const category = row["Pasillo UberEats"];
    const brand = row["Marca UberEats"] || null;
    const ubereatsName = row["Nombre exacto en UberEats"];
    const defaultQty = row["Qty default"] || 1;
    const notes = row["Alternativas / Notas"] || null;

    if (!name || !ubereatsName) {
      console.warn(`Skipping row with missing data: ${JSON.stringify(row)}`);
      continue;
    }

    const unit = deriveUnit(name, ubereatsName, notes, category);
    const catOrder = categoryOrder[category] || 99;
    sortOrder++;

    await prisma.product.create({
      data: {
        name,
        category,
        brand,
        ubereatsName: ubereatsName,
        defaultQty: typeof defaultQty === "number" ? defaultQty : 1,
        unit,
        notes,
        sortOrder: catOrder * 1000 + sortOrder,
      },
    });

    console.log(
      `  + ${name} (${category}) → ${defaultQty} ${unit}`
    );
  }

  const count = await prisma.product.count();
  console.log(`\nDone! ${count} products seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
