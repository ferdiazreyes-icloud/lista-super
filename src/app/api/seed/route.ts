import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PRODUCTS = [
  { name: "Aguacate", category: "Frutas y Verduras", brand: null, ubereatsName: "Aguacate hass", defaultQty: 5, unit: "pza", notes: null, sortOrder: 1001 },
  { name: "Plátano", category: "Frutas y Verduras", brand: null, ubereatsName: "Plátano de chiapas/tabasco", defaultQty: 8, unit: "pza", notes: null, sortOrder: 1002 },
  { name: "Piña", category: "Frutas y Verduras", brand: null, ubereatsName: "Piña miel tipo gota", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1003 },
  { name: "Acelgas", category: "Frutas y Verduras", brand: null, ubereatsName: "Acelga", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1004 },
  { name: "Ajo", category: "Frutas y Verduras", brand: "Gocer", ubereatsName: "Ajo fresco en malla (4 un)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1005 },
  { name: "Apio", category: "Frutas y Verduras", brand: "Mr. Lucky", ubereatsName: "Corazones de apio orgánico", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1006 },
  { name: "Betabel", category: "Frutas y Verduras", brand: null, ubereatsName: "Betabel", defaultQty: 1, unit: "kg", notes: "Por kg", sortOrder: 1007 },
  { name: "Blueberry", category: "Frutas y Verduras", brand: null, ubereatsName: "Mora azul (170 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1008 },
  { name: "Brócoli", category: "Frutas y Verduras", brand: "Mr. Lucky", ubereatsName: "Floretes de brócoli frescos (454 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1009 },
  { name: "Calabaza (chicas)", category: "Frutas y Verduras", brand: null, ubereatsName: "Calabaza italiana", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1010 },
  { name: "Cebolla (grande)", category: "Frutas y Verduras", brand: null, ubereatsName: "Cebolla blanca", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1011 },
  { name: "Champiñones", category: "Frutas y Verduras", brand: "Monteblanco", ubereatsName: "Champiñones y creminis frescos enteros (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1012 },
  { name: "Chayote", category: "Frutas y Verduras", brand: null, ubereatsName: "Chayote", defaultQty: 2, unit: "pza", notes: null, sortOrder: 1013 },
  { name: "Chile cuaresmeño", category: "Frutas y Verduras", brand: null, ubereatsName: "Chile cuaresmeño", defaultQty: 6, unit: "pza", notes: null, sortOrder: 1014 },
  { name: "Chiles poblanos", category: "Frutas y Verduras", brand: null, ubereatsName: "Chile poblano", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1015 },
  { name: "Chiles serranos", category: "Frutas y Verduras", brand: null, ubereatsName: "Chile serrano", defaultQty: 15, unit: "pza", notes: null, sortOrder: 1016 },
  { name: "Cilantro", category: "Frutas y Verduras", brand: null, ubereatsName: "Manojo de cilantro", defaultQty: 1, unit: "manojo", notes: null, sortOrder: 1017 },
  { name: "Ciruela", category: "Frutas y Verduras", brand: null, ubereatsName: "Ciruela", defaultQty: 8, unit: "pza", notes: "De temporada", sortOrder: 1018 },
  { name: "Coliflor", category: "Frutas y Verduras", brand: null, ubereatsName: "Coliflor preenfriada", defaultQty: 1, unit: "kg", notes: "~1.2 kg", sortOrder: 1019 },
  { name: "Durazno", category: "Frutas y Verduras", brand: null, ubereatsName: "Durazno", defaultQty: 8, unit: "pza", notes: "De temporada", sortOrder: 1020 },
  { name: "Elote", category: "Frutas y Verduras", brand: "La Huerta", ubereatsName: "Elote entero congelado (4 un)", defaultQty: 1, unit: "paquete", notes: "Congelado", sortOrder: 1021 },
  { name: "Epazote", category: "Frutas y Verduras", brand: null, ubereatsName: "Epazote Rollo", defaultQty: 1, unit: "rollo", notes: null, sortOrder: 1022 },
  { name: "Espárragos", category: "Frutas y Verduras", brand: "Fresh Garden", ubereatsName: "Espárragos verdes (450 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1023 },
  { name: "Espinaca", category: "Frutas y Verduras", brand: "Earthbound Farm", ubereatsName: "Ensalada de espinacas baby (142 g)", defaultQty: 1, unit: "paquete", notes: "Alt: Mr. Lucky Espinaca popeye", sortOrder: 1024 },
  { name: "Flor de calabaza", category: "Frutas y Verduras", brand: null, ubereatsName: "Flor de calabaza", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1025 },
  { name: "Fresas", category: "Frutas y Verduras", brand: null, ubereatsName: "Fresas frescas (454 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1026 },
  { name: "Germen", category: "Frutas y Verduras", brand: "Germimax", ubereatsName: "Germen de alfalfa (200 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1027 },
  { name: "Granada", category: "Frutas y Verduras", brand: null, ubereatsName: "Granada", defaultQty: 6, unit: "pza", notes: "De temporada", sortOrder: 1028 },
  { name: "Guayaba", category: "Frutas y Verduras", brand: null, ubereatsName: "Guayaba", defaultQty: 5, unit: "pza", notes: null, sortOrder: 1029 },
  { name: "Jengibre", category: "Frutas y Verduras", brand: null, ubereatsName: "Jengibre", defaultQty: 1, unit: "pza", notes: "~100 g", sortOrder: 1030 },
  { name: "Jícama", category: "Frutas y Verduras", brand: null, ubereatsName: "Jícama", defaultQty: 1, unit: "kg", notes: "~1.3 kg", sortOrder: 1031 },
  { name: "Jitomate", category: "Frutas y Verduras", brand: null, ubereatsName: "Jitomate saladette", defaultQty: 18, unit: "pza", notes: null, sortOrder: 1032 },
  { name: "Jitomate mini", category: "Frutas y Verduras", brand: "NatureSweet", ubereatsName: "Cherubs tomate uva (467 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1033 },
  { name: "Kale", category: "Frutas y Verduras", brand: null, ubereatsName: "Kale", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1034 },
  { name: "Kiwi", category: "Frutas y Verduras", brand: null, ubereatsName: "Kiwi", defaultQty: 4, unit: "pza", notes: null, sortOrder: 1035 },
  { name: "Lechuga", category: "Frutas y Verduras", brand: "Fresh Garden", ubereatsName: "Lechuga dulce sucrine (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 1036 },
  { name: "Limón", category: "Frutas y Verduras", brand: null, ubereatsName: "Limón sin semilla", defaultQty: 10, unit: "pza", notes: "A veces Limón colima agrio", sortOrder: 1037 },
  { name: "Mango", category: "Frutas y Verduras", brand: null, ubereatsName: "Mango oro", defaultQty: 6, unit: "pza", notes: "Alt: Mango ataulfo (temporada)", sortOrder: 1038 },
  { name: "Manzana", category: "Frutas y Verduras", brand: null, ubereatsName: "Manzana royal gala", defaultQty: 3, unit: "pza", notes: "A veces Granny Smith", sortOrder: 1039 },
  { name: "Melón", category: "Frutas y Verduras", brand: null, ubereatsName: "Melón", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1040 },
  { name: "Naranja", category: "Frutas y Verduras", brand: null, ubereatsName: "Naranja paramount", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1041 },
  { name: "Nopales (chico)", category: "Frutas y Verduras", brand: null, ubereatsName: "Nopal cambray", defaultQty: 6, unit: "pza", notes: null, sortOrder: 1042 },
  { name: "Papa", category: "Frutas y Verduras", brand: null, ubereatsName: "Papa blanca", defaultQty: 2, unit: "pza", notes: "A veces russet", sortOrder: 1043 },
  { name: "Papaya", category: "Frutas y Verduras", brand: null, ubereatsName: "Papaya maradol", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1044 },
  { name: "Pepino", category: "Frutas y Verduras", brand: null, ubereatsName: "Pepino", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1045 },
  { name: "Pera", category: "Frutas y Verduras", brand: null, ubereatsName: "Pera de anjou", defaultQty: 4, unit: "pza", notes: null, sortOrder: 1046 },
  { name: "Perejil", category: "Frutas y Verduras", brand: null, ubereatsName: "Manojo de perejil liso", defaultQty: 1, unit: "manojo", notes: null, sortOrder: 1047 },
  { name: "Pimiento (colores)", category: "Frutas y Verduras", brand: null, ubereatsName: "Pimiento morrón rojo/naranja/amarillo", defaultQty: 3, unit: "pza", notes: "1 de cada color", sortOrder: 1048 },
  { name: "Sandía", category: "Frutas y Verduras", brand: null, ubereatsName: "Sandía baby", defaultQty: 1, unit: "kg", notes: "~2 kg", sortOrder: 1049 },
  { name: "Sopa verduras", category: "Frutas y Verduras", brand: null, ubereatsName: "Verduras para sopa", defaultQty: 1, unit: "pza", notes: null, sortOrder: 1050 },
  { name: "Tomate verde", category: "Frutas y Verduras", brand: null, ubereatsName: "Tomate verde", defaultQty: 20, unit: "pza", notes: null, sortOrder: 1051 },
  { name: "Toronja", category: "Frutas y Verduras", brand: null, ubereatsName: "Toronja", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1052 },
  { name: "Uva", category: "Frutas y Verduras", brand: null, ubereatsName: "Uva verde sin semilla", defaultQty: 1, unit: "kg", notes: "1 kg", sortOrder: 1053 },
  { name: "Zanahoria", category: "Frutas y Verduras", brand: null, ubereatsName: "Zanahoria", defaultQty: 3, unit: "pza", notes: null, sortOrder: 1054 },
  { name: "Leche de vaca", category: "Lácteos y Huevo", brand: "Santa Clara", ubereatsName: "Leche semidescremada deslactosada (4 x 1 L)", defaultQty: 1, unit: "pack", notes: "Pack de 4 litros", sortOrder: 2055 },
  { name: "Leche almendra", category: "Lácteos y Huevo", brand: null, ubereatsName: "Leche de almendra", defaultQty: 1, unit: "pza", notes: null, sortOrder: 2056 },
  { name: "Huevo", category: "Lácteos y Huevo", brand: "San Juan", ubereatsName: "Huevo blanco (25 un)", defaultQty: 1, unit: "paquete", notes: "Sr Queso: docenera libre pastoreo $65", sortOrder: 2057 },
  { name: "Queso oaxaca", category: "Lácteos y Huevo", brand: "Los Volcanes", ubereatsName: "Queso oaxaca (400 g)", defaultQty: 1, unit: "paquete", notes: "SIEMPRE Los Volcanes. Sr Queso más barato ($78/400g vs $88) pero user prefiere esta marca", sortOrder: 2058 },
  { name: "Crema", category: "Lácteos y Huevo", brand: "Los Volcanes", ubereatsName: "Crema Los Volcanes (450 ml)", defaultQty: 1, unit: "kg", notes: "SIEMPRE Los Volcanes. Sr Queso crema rancho $50/½kg más barata pero user prefiere esta marca", sortOrder: 2059 },
  { name: "Queso La vaca que ríe", category: "Lácteos y Huevo", brand: null, ubereatsName: "Queso La vaca que ríe", defaultQty: 1, unit: "pza", notes: null, sortOrder: 2060 },
  { name: "Queso panela", category: "Lácteos y Huevo", brand: "Los Volcanes", ubereatsName: "Queso panela (400 g)", defaultQty: 1, unit: "kg", notes: "Sr Queso: $195/kg = $78/400g vs $85 Chedraui", sortOrder: 2061 },
  { name: "Queso crema", category: "Lácteos y Huevo", brand: "Philadelphia", ubereatsName: "Queso crema original (200 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 2062 },
  { name: "Mantequilla", category: "Lácteos y Huevo", brand: "Gloria", ubereatsName: "Mantequilla sin sal (90 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 2063 },
  { name: "Yakult", category: "Lácteos y Huevo", brand: "Yakult", ubereatsName: "Alimento a base de leche fermentada (5 x 80 ml)", defaultQty: 1, unit: "pack", notes: null, sortOrder: 2064 },
  { name: "Crema Alpura", category: "Lácteos y Huevo", brand: "Alpura", ubereatsName: "Selecta crema premium acidificada (426 ml)", defaultQty: 1, unit: "paquete", notes: "Backup si no hay Los Volcanes", sortOrder: 2065 },
  { name: "Tortilla", category: "Pan y Tortilla", brand: "Chedraui", ubereatsName: "Tortilla amarilla", defaultQty: 1, unit: "kg", notes: "2 kg. Sr Queso tiene a $35/kg", sortOrder: 3066 },
  { name: "Tortillas harina", category: "Pan y Tortilla", brand: "Tía Rosa", ubereatsName: "Tortillinas de harina de trigo (22 un)", defaultQty: 1, unit: "kg", notes: "Sr Queso tiene harina natural $35/½kg", sortOrder: 3067 },
  { name: "Tostadas", category: "Pan y Tortilla", brand: "Saníssimo", ubereatsName: "Tostadas horneadas de maíz blanco (216 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 3068 },
  { name: "Tostaditas (Salmas)", category: "Pan y Tortilla", brand: "Saníssimo", ubereatsName: "Salmas tostaditas de maíz horneadas (20x3 un)", defaultQty: 1, unit: "pack", notes: null, sortOrder: 3069 },
  { name: "Pan \"señora\"", category: "Pan y Tortilla", brand: "Oroweat", ubereatsName: "Pan de harina de trigo con mantequilla rebanado (16 un)", defaultQty: 1, unit: "paquete", notes: "Alt: Ezekiel 4:9", sortOrder: 3070 },
  { name: "Jamón (pavo)", category: "Carnes Frías", brand: "Sabori", ubereatsName: "Pechuga de pavo extrafina (250 g)", defaultQty: 1, unit: "kg", notes: "~0.3 kg. Sr Queso: pechuga pavo orgánica $190/¼kg", sortOrder: 4071 },
  { name: "Salchichas pavo", category: "Carnes Frías", brand: "Peñaranda", ubereatsName: "Salchicha de pechuga de pavo (400 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 4072 },
  { name: "Salchichas pavo mini", category: "Carnes Frías", brand: "Peñaranda", ubereatsName: "Turkey baby salchicha de pechuga de pavo (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 4073 },
  { name: "Aceite de oliva", category: "Despensa", brand: "Carapelli", ubereatsName: "Aceite de oliva extra virgen oro verde (1 L)", defaultQty: 2, unit: "paquete", notes: "Sr Queso: Aires del Campo virgen $230/500ml", sortOrder: 5074 },
  { name: "Aceite ajonjolí", category: "Despensa", brand: null, ubereatsName: "Aceite de ajonjolí", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5075 },
  { name: "Aceite de aguacate", category: "Despensa", brand: null, ubereatsName: "Aceite de aguacate", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5076 },
  { name: "Sal de mar", category: "Despensa", brand: "Altamar", ubereatsName: "Sal de mar artesanal (400 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5077 },
  { name: "Aceitunas", category: "Despensa", brand: null, ubereatsName: "Aceitunas", defaultQty: 1, unit: "kg", notes: "Sr Queso: Kalamata colosal $75/¼kg", sortOrder: 5078 },
  { name: "Garbanzo", category: "Despensa", brand: null, ubereatsName: "Garbanzo", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5079 },
  { name: "Lentejas", category: "Despensa", brand: null, ubereatsName: "Lentejas", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5080 },
  { name: "Quinoa", category: "Despensa", brand: "OKKO", ubereatsName: "Mezcla 3 quinoas (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5081 },
  { name: "Frijoles", category: "Despensa", brand: "Chedraui", ubereatsName: "Frijol negro (900 g)", defaultQty: 1, unit: "kg", notes: "Sr Queso: Aires del Campo $95/kg", sortOrder: 5082 },
  { name: "Chía", category: "Despensa", brand: null, ubereatsName: "Chía", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5083 },
  { name: "Pasta", category: "Despensa", brand: "Barilla", ubereatsName: "Pasta de sémola (200 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5084 },
  { name: "Sopa Fideo", category: "Despensa", brand: "Barilla", ubereatsName: "Pasta de sémola fideo n.º 2 (200 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5085 },
  { name: "Mole", category: "Despensa", brand: null, ubereatsName: "Mole", defaultQty: 1, unit: "kg", notes: "Sr Queso: Mole dulce La Noria $210/½kg", sortOrder: 5086 },
  { name: "Chipotles", category: "Despensa", brand: "La Costeña", ubereatsName: "Chiles jalapeños enteros / chipotles", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5087 },
  { name: "Consomé vegetales", category: "Despensa", brand: null, ubereatsName: "Consomé de vegetales", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5088 },
  { name: "Harina de trigo", category: "Despensa", brand: "Selecta", ubereatsName: "Harina de trigo (1 kg)", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5089 },
  { name: "Azúcar morena", category: "Despensa", brand: "Zulka", ubereatsName: "Azúcar morena de caña 100% natural (900 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5090 },
  { name: "Avena", category: "Despensa", brand: "Quaker Oats", ubereatsName: "Hojuelas de avena integral (475 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5091 },
  { name: "Cocoa Hersheys", category: "Despensa", brand: "Hersheys", ubereatsName: "Cocoa Hersheys", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5092 },
  { name: "Gelatina", category: "Despensa", brand: null, ubereatsName: "Gelatina", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5093 },
  { name: "Lechera", category: "Despensa", brand: "La Lechera", ubereatsName: "Leche condensada original (375 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5094 },
  { name: "Mostaza Dijón", category: "Despensa", brand: null, ubereatsName: "Mostaza Dijón", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5095 },
  { name: "Mostaza clásica", category: "Despensa", brand: null, ubereatsName: "Mostaza clásica", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5096 },
  { name: "Mermelada", category: "Despensa", brand: null, ubereatsName: "Mermelada", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5097 },
  { name: "Chile Tajín", category: "Despensa", brand: "Tajín", ubereatsName: "Chile en polvo (142 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5098 },
  { name: "Moringa", category: "Despensa", brand: null, ubereatsName: "Moringa", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5099 },
  { name: "Miel de abeja", category: "Despensa", brand: "Tía Ofilia", ubereatsName: "Miel de abeja extra virgen (330 g)", defaultQty: 1, unit: "paquete", notes: "Sr Queso: miel cruda $180/350g", sortOrder: 5100 },
  { name: "Atún en lata", category: "Despensa", brand: null, ubereatsName: "Atún en lata", defaultQty: 1, unit: "lata", notes: null, sortOrder: 5101 },
  { name: "Tofu", category: "Despensa", brand: "House Foods", ubereatsName: "Prémium tofu medio firme pasteurizado (396 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5102 },
  { name: "Salsa Búfalo", category: "Despensa", brand: "Búfalo", ubereatsName: "Salsa picante clásica (150 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5103 },
  { name: "Salsa de soya", category: "Despensa", brand: "Kikkoman", ubereatsName: "Salsa de soya (296 ml)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5104 },
  { name: "Salsa para pasta", category: "Despensa", brand: "Prego", ubereatsName: "Salsa italiana tradicional de tomate para pasta (680 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5105 },
  { name: "Salsa maggi", category: "Despensa", brand: "Maggi", ubereatsName: "Jugo sazonador (200 ml)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5106 },
  { name: "Salsa inglesa", category: "Despensa", brand: "Crosse & blackwell", ubereatsName: "salsa inglesa", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5107 },
  { name: "Salsa ketchup", category: "Despensa", brand: "Heinz", ubereatsName: "Ketchup salsa tradicional (397 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 5108 },
  { name: "Desinfectante Microdín", category: "Despensa", brand: "Microdín", ubereatsName: "Desinfectante de frutas y verduras", defaultQty: 1, unit: "pza", notes: null, sortOrder: 5109 },
  { name: "Rajas congeladas", category: "Congelados", brand: "La Huerta", ubereatsName: "Rajas poblanas asadas y peladas (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 6110 },
  { name: "Champiñón congelado", category: "Congelados", brand: "Monteblanco", ubereatsName: "Setas enteras frescas (250 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 6111 },
  { name: "Granos de elote", category: "Congelados", brand: "La Huerta", ubereatsName: "Elote en grano (500 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 6112 },
  { name: "Chícharo", category: "Congelados", brand: null, ubereatsName: "Chícharo congelado", defaultQty: 1, unit: "pza", notes: null, sortOrder: 6113 },
  { name: "Ejotes congelados", category: "Congelados", brand: null, ubereatsName: "Ejote verde", defaultQty: 1, unit: "kg", notes: "~0.4 kg", sortOrder: 6114 },
  { name: "Sopes de maíz", category: "Congelados", brand: "Ochoa", ubereatsName: "Sopes de maíz (540 g)", defaultQty: 4, unit: "paquete", notes: "Sr Queso: sopes $45", sortOrder: 6115 },
  { name: "Pan ezequiel", category: "Congelados", brand: "Ezekiel 4:9", ubereatsName: "Pan grano entero sin harina (680 g)", defaultQty: 1, unit: "paquete", notes: "Food for life . Pan siete granos (680 g)", sortOrder: 6116 },
  { name: "Jugo de frutas", category: "Bebidas", brand: "Jumex", ubereatsName: "Único fresco jugo de naranja sin pulpa (960 ml)", defaultQty: 6, unit: "paquete", notes: null, sortOrder: 7117 },
  { name: "Agua de coco", category: "Bebidas", brand: null, ubereatsName: "Agua de coco", defaultQty: 1, unit: "botella", notes: null, sortOrder: 7118 },
  { name: "Nueces mixtas", category: "Frutos Secos", brand: "Verde Valle", ubereatsName: "Snack de nuez en mitades (75 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 8119 },
  { name: "Arándano", category: "Frutos Secos", brand: "Verde Valle", ubereatsName: "Arándano deshidratado (75 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 8120 },
  { name: "Almendras", category: "Frutos Secos", brand: "Verde Valle", ubereatsName: "Almendra entera (75 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 8121 },
  { name: "Nuez", category: "Frutos Secos", brand: "Verde Valle", ubereatsName: "Snack de nuez en mitades (75 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 8122 },
  { name: "Chile morita", category: "Frutos Secos", brand: "Chedraui", ubereatsName: "Chile morita", defaultQty: 1, unit: "pza", notes: null, sortOrder: 8123 },
  { name: "Chile guajillo", category: "Frutos Secos", brand: "Chedraui", ubereatsName: "Chile guajillo", defaultQty: 1, unit: "pza", notes: null, sortOrder: 8124 },
  { name: "Chile ancho", category: "Frutos Secos", brand: "Chedraui", ubereatsName: "Chile ancho", defaultQty: 1, unit: "pza", notes: null, sortOrder: 8125 },
  { name: "Jamaica", category: "Frutos Secos", brand: "Chedraui", ubereatsName: "Flor de jamaica (250 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 8126 },
  { name: "Servilletas", category: "Limpieza y Hogar", brand: "Kleenex", ubereatsName: "Class servilletas de hojas dobles (200 un)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 10127 },
  { name: "Servitoallas", category: "Limpieza y Hogar", brand: "Regio", ubereatsName: "Toallas de papel con hojas dobles advanced", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10128 },
  { name: "Papel de baño", category: "Limpieza y Hogar", brand: "Regio", ubereatsName: "Just 1 papel higiénico hojas cuádruples (12 un)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 10129 },
  { name: "Kleenex", category: "Limpieza y Hogar", brand: "Kleenex", ubereatsName: "Kleenex pañuelos desechables", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10130 },
  { name: "Limpiador vidrio", category: "Limpieza y Hogar", brand: null, ubereatsName: "Limpiador de vidrio", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10131 },
  { name: "Brasso", category: "Limpieza y Hogar", brand: "Brasso", ubereatsName: "Brasso", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10132 },
  { name: "Fibra verde", category: "Limpieza y Hogar", brand: "Scotch-Brite", ubereatsName: "Fibra para limpieza profunda de cocina, verde", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10133 },
  { name: "Pato Purific", category: "Limpieza y Hogar", brand: "Pato", ubereatsName: "Pato Purific", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10134 },
  { name: "Cloro baños", category: "Limpieza y Hogar", brand: null, ubereatsName: "Cloro para baños", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10135 },
  { name: "Cloralex", category: "Limpieza y Hogar", brand: "Cloralex", ubereatsName: "Cloralex", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10136 },
  { name: "Jabón Zote", category: "Limpieza y Hogar", brand: "Zote", ubereatsName: "Jabón líquido blanco (1 L)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 10137 },
  { name: "Fabuloso", category: "Limpieza y Hogar", brand: "Fabuloso", ubereatsName: "Limpiador multiusos líquido antibacterial, fresca lavanda (5 L)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 10138 },
  { name: "Lavatrastes Axion", category: "Limpieza y Hogar", brand: "Axion", ubereatsName: "Lavatrastes Axion", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10139 },
  { name: "Vanish", category: "Limpieza y Hogar", brand: "Vanish", ubereatsName: "Vanish", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10140 },
  { name: "Jabón lavadora", category: "Limpieza y Hogar", brand: null, ubereatsName: "Jabón para lavadora", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10141 },
  { name: "Suavitel", category: "Limpieza y Hogar", brand: "Suavitel", ubereatsName: "Suavitel", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10142 },
  { name: "Jabón en barra", category: "Limpieza y Hogar", brand: "Lirio", ubereatsName: "Jabón de tocador dermatológico en barra (4 x 150 g)", defaultQty: 1, unit: "pack", notes: null, sortOrder: 10143 },
  { name: "Bolsas basura", category: "Limpieza y Hogar", brand: "Costalitos", ubereatsName: "Bolsas ecológicas para basura, G (10 un)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 10144 },
  { name: "Guantes grandes", category: "Limpieza y Hogar", brand: "Chedraui", ubereatsName: "Guantes afelpados multiusos", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10145 },
  { name: "Guantes chicos", category: "Limpieza y Hogar", brand: "Chedraui", ubereatsName: "Guantes satinados multiusos, CH", defaultQty: 1, unit: "pza", notes: null, sortOrder: 10146 },
  { name: "Ziploc", category: "Otros", brand: "Ziploc", ubereatsName: "Bolsas Ziploc", defaultQty: 1, unit: "pza", notes: null, sortOrder: 9147 },
  { name: "Granola", category: "Otros", brand: "Granvita", ubereatsName: "Granola 0% azúcar con almendras y canela (350 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 9148 },
  { name: "Malvaviscos", category: "Otros", brand: "de la Rosa", ubereatsName: "Malvaviscos drums gigantes (340 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 9149 },
  { name: "Prot. incontinencia", category: "Cuidado Personal", brand: "Depend", ubereatsName: "Protectores predoblados Unitalla (10 un)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 11150 },
  { name: "Shampoo", category: "Cuidado Personal", brand: "Mennen", ubereatsName: "Shampoo zero cabello saludable (1 L)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 11151 },
  { name: "Acondicionador", category: "Cuidado Personal", brand: "Herbal Essences", ubereatsName: "Acondicionador agua de coco & jazmín (400 ml)", defaultQty: 2, unit: "paquete", notes: null, sortOrder: 11152 },
  { name: "Gel fijador", category: "Cuidado Personal", brand: "Grisi", ubereatsName: "Gel fijador de manzanilla máximo control (400 g)", defaultQty: 1, unit: "paquete", notes: null, sortOrder: 11153 }
];

// Sr. del Queso products (44 products, 6 subcategories)
const QUESO_PRODUCTS = [
  // QUESOS (12)
  { name: "Oaxaca", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20001 },
  { name: "Panela", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20002 },
  { name: "Manchego", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20003 },
  { name: "Chihuahua curado", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20004 },
  { name: "Gouda", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20005 },
  { name: "De Chiapas", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20006 },
  { name: "Parmesano rallado", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "200 g", sortOrder: 20007 },
  { name: "Gouda rallado", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "200 g", sortOrder: 20008 },
  { name: "Feta", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "200 g", sortOrder: 20009 },
  { name: "Queso cabra español", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "200 g", sortOrder: 20010 },
  { name: "Crema de rancho", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: "½ kg", sortOrder: 20011 },
  { name: "Cottage", category: "Quesos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "200 g", sortOrder: 20012 },
  // TORTILLAS Y MAÍZ (8)
  { name: "Tortilla maíz", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20013 },
  { name: "Totopos", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20014 },
  { name: "Tiritas para sopa", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20015 },
  { name: "Tortilla harina", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: "½ kg", sortOrder: 20016 },
  { name: "Sopes", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: "8 pzas", sortOrder: 20017 },
  { name: "Nopal con chía", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20018 },
  { name: "Betabel con quinoa", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20019 },
  { name: "Tostadas de nopal", category: "Tortillas y Maíz", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20020 },
  // COCINA LIBANESA (5)
  { name: "Pan árabe", category: "Cocina Libanesa", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20021 },
  { name: "Pan árabe tostado", category: "Cocina Libanesa", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "paq", notes: null, sortOrder: 20022 },
  { name: "Hummus", category: "Cocina Libanesa", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20023 },
  { name: "Jocoque", category: "Cocina Libanesa", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20024 },
  { name: "Aceituna Kalamata", category: "Cocina Libanesa", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: "¼ kg", sortOrder: 20025 },
  // POLLO (7)
  { name: "Pechuga entera", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20026 },
  { name: "Pechuga deshuesada", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20027 },
  { name: "Molida de pechuga", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20028 },
  { name: "Milanesa de pollo", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20029 },
  { name: "Pierna de pollo", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20030 },
  { name: "Muslo de pollo", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20031 },
  { name: "Alitas", category: "Pollo", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20032 },
  // SALCHICHONERÍA (4)
  { name: "Chorizo español", category: "Salchichonería", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20033 },
  { name: "Chorizo argentino", category: "Salchichonería", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20034 },
  { name: "Longaniza", category: "Salchichonería", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20035 },
  { name: "Chistorra", category: "Salchichonería", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20036 },
  // ORGÁNICOS (8)
  { name: "Aceite de Coco", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: null, sortOrder: 20037 },
  { name: "Arroz blanco", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20038 },
  { name: "Avena", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20039 },
  { name: "Frijol Negro", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20040 },
  { name: "Lenteja", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 20041 },
  { name: "Aceite de Oliva Virgen", category: "Orgánicos", store: "queso", brand: "Aires del Campo", ubereatsName: "", defaultQty: 0, unit: "pza", notes: "500 ml", sortOrder: 20042 },
  { name: "Miel de abeja cruda", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "350 g", sortOrder: 20043 },
  { name: "Docenera libre pastoreo", category: "Orgánicos", store: "queso", brand: null, ubereatsName: "", defaultQty: 0, unit: "pza", notes: "Huevos", sortOrder: 20044 },
];

// Carne Vecino products (36 products, 3 subcategories — all sold by kg)
const CARNE_PRODUCTS = [
  // RES (17)
  { name: "Arrachera", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30001 },
  { name: "Filete de res limpio", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30002 },
  { name: "Rib Eye", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30003 },
  { name: "New York", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30004 },
  { name: "T Bone", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30005 },
  { name: "Sirloin / Churrasco", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30006 },
  { name: "Vacío", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30007 },
  { name: "Picaña", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30008 },
  { name: "Asado de tira", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30009 },
  { name: "Cecina natural", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30010 },
  { name: "Costilla de res", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30011 },
  { name: "Bistec 1era", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30012 },
  { name: "Molida especial", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30013 },
  { name: "Falda", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30014 },
  { name: "Chamberete sin hueso", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30015 },
  { name: "Chamberete con hueso", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30016 },
  { name: "Tuétano", category: "Res", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30017 },
  // CERDO (15)
  { name: "Chicharrón delgado", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30018 },
  { name: "Chicharrón carnudo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30019 },
  { name: "Chicharrón prensado", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30020 },
  { name: "Tocino", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30021 },
  { name: "Pastor", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30022 },
  { name: "Cecina enchilada", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30023 },
  { name: "Chuleta natural", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30024 },
  { name: "Chuleta ahumada", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30025 },
  { name: "Costilla de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30026 },
  { name: "Bistec de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30027 },
  { name: "Molida de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30028 },
  { name: "Filete de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30029 },
  { name: "Lomo de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30030 },
  { name: "Pierna de cerdo", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30031 },
  { name: "Baby Back Ribs", category: "Cerdo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30032 },
  // POLLO (4)
  { name: "Pechuga con hueso", category: "Pollo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30033 },
  { name: "Pechuga sin hueso", category: "Pollo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30034 },
  { name: "Milanesa de pollo", category: "Pollo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30035 },
  { name: "Pierna y muslo", category: "Pollo", store: "carne", brand: null, ubereatsName: "", defaultQty: 0, unit: "kg", notes: null, sortOrder: 30036 },
];

/**
 * GET /api/seed — Endpoint to populate products from Excel data.
 * Checks each store independently so new stores can be added without re-seeding existing ones.
 */
export async function GET() {
  try {
    const results: string[] = [];

    // Seed UberEats products
    const ubereatsCount = await prisma.product.count({ where: { store: "ubereats" } });
    if (ubereatsCount === 0) {
      for (const p of PRODUCTS) {
        await prisma.product.create({ data: { ...p, store: "ubereats" } });
      }
      results.push(`UberEats: ${PRODUCTS.length} productos cargados`);
    } else {
      results.push(`UberEats: ya existían ${ubereatsCount} productos`);
    }

    // Seed Sr. del Queso products
    const quesoCount = await prisma.product.count({ where: { store: "queso" } });
    if (quesoCount === 0) {
      for (const p of QUESO_PRODUCTS) {
        await prisma.product.create({ data: p });
      }
      results.push(`Sr. del Queso: ${QUESO_PRODUCTS.length} productos cargados`);
    } else {
      results.push(`Sr. del Queso: ya existían ${quesoCount} productos`);
    }

    // Seed Carne Vecino products
    const carneCount = await prisma.product.count({ where: { store: "carne" } });
    if (carneCount === 0) {
      for (const p of CARNE_PRODUCTS) {
        await prisma.product.create({ data: p });
      }
      results.push(`Carne Vecino: ${CARNE_PRODUCTS.length} productos cargados`);
    } else {
      results.push(`Carne Vecino: ya existían ${carneCount} productos`);
    }

    const total = await prisma.product.count();
    return NextResponse.json({
      message: `¡Listo! Total: ${total} productos.`,
      details: results,
      total,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Error al cargar productos", details: String(error) },
      { status: 500 }
    );
  }
}
