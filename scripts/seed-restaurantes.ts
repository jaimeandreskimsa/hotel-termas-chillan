import { readFileSync } from 'fs';
import { resolve } from 'path';
try {
  const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
  }
} catch {}

import { db } from '../lib/db/index';
import { restaurantItems } from '../lib/db/schema';

const items: (typeof restaurantItems.$inferInsert)[] = [

  // ─── ARBOLEDA – VINOS ────────────────────────────────────────────────────────
  // Burbujas del mundo
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Imperial Brut, Moët & Chandon, Francia', price: '$158.000', active: true, order: 1 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Don Perignon, Möet & Chandon, Francia', price: '$450.000', active: true, order: 2 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Hera, Calyptra, Cachapoal Andes', price: '$35.000', active: true, order: 3 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Cordillera, Extra Brut, Miguel Torres, Curicó', price: '$28.500', active: true, order: 4 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Chandon Brut, Luján de Cuyo', price: '$28.000', active: true, order: 5 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Loma Larga, Brut Nature, Casablanca', price: '$28.000', active: true, order: 6 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Berta (Nature, E. Brut y Doux), Itata', price: '$25.000', active: true, order: 7 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Burbujas del mundo', name: 'Estelado, Rose Brut, Miguel Torres, Maule', price: '$23.000', active: true, order: 8 },
  // Sauvignon blanc
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Cipreses, Casa Marín, San Antonio', price: '$35.000', active: true, order: 9 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Outer Limits, Montes, Petorca', price: '$29.000', active: true, order: 10 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Cordillera, Miguel Torres, Maule Costa', price: '$25.000', active: true, order: 11 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Vetas Blancas, Tabalí, Limarí', price: '$25.000', active: true, order: 12 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Chagual, Los Vascos, Colchagua', price: '$21.000', active: true, order: 13 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Sauvignon blanc', name: 'Ritual, Veramonte, Casablanca', price: '$20.000', active: true, order: 14 },
  // Chardonnay
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Chardonnay', name: 'Tara, Ventisquero, Atacama', price: '$55.000', active: true, order: 15 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Chardonnay', name: 'Los Parientes, Pandolfi Price, Itata', price: '$35.000', active: true, order: 16 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Chardonnay', name: 'Cordillera, Miguel Torres, Limarí', price: '$25.000', active: true, order: 17 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Chardonnay', name: 'Ritual, Veramonte, Casablanca', price: '$20.000', active: true, order: 18 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Chardonnay', name: 'Pedregoso, Tabalí, Limarí', price: '$20.000', active: true, order: 19 },
  // Pinot noir
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Pinot noir', name: 'Vetas Blancas, Tabalí, Limarí', price: '$25.000', active: true, order: 20 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Pinot noir', name: 'Loma Larga, Casablanca', price: '$20.000', active: true, order: 21 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Pinot noir', name: 'Berta, Santa Berta, Itata', price: '$20.000', active: true, order: 22 },
  // Merlot
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Merlot', name: 'Pedregoso, Tabalí, Limarí', price: '$23.000', active: true, order: 23 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Merlot', name: 'Cuvee Alexander, Lapostolle, Colchagua', price: '$23.000', active: true, order: 24 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Merlot', name: 'Santa Digna, Miguel Torres, Valle Central', price: '$20.000', active: true, order: 25 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Merlot', name: 'Ritual, Veramonte, Casablanca', price: '$20.000', active: true, order: 26 },
  // Carmenere
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Carmín de Peumo, Concha y Toro, Cachapoal', price: '$150.000', active: true, order: 27 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'El Incidente, Viu Manent, Colchagua', price: '$78.000', active: true, order: 28 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Maturana, Maturana Wines, Colchagua', price: '$45.000', active: true, order: 29 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Cordillera, Miguel Torres, Cachapoal', price: '$25.000', active: true, order: 30 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Micas, Tabalí, Cachapoal', price: '$23.000', active: true, order: 31 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Cota 400, Andes Plateau, Maule', price: '$21.000', active: true, order: 32 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Carmenere', name: 'Ándica, Miguel Torres, Maule', price: '$20.000', active: true, order: 33 },
  // Cabernet sauvignon
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Manso de Velasco, Miguel Torres, Maule', price: '$90.000', active: true, order: 34 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Enclave, Ventisquero, Maipo', price: '$72.000', active: true, order: 35 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Forajidos #1, Forajidos Wine, Maipo', price: '$48.000', active: true, order: 36 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Grand Clos, Boldos, Cachapoal', price: '$40.000', active: true, order: 37 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Cordillera, Miguel Torres, Maipo', price: '$25.000', active: true, order: 38 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Cota 500, Andes Plateau, Maipo', price: '$23.000', active: true, order: 39 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Montes Alpha, Montes, Colchagua', price: '$23.000', active: true, order: 40 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Pedregoso, Tabalí, Maipo', price: '$20.000', active: true, order: 41 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Cabernet sauvignon', name: 'Ándica, Miguel Torres, Itata', price: '$20.000', active: true, order: 42 },
  // Syrah
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Syrah', name: 'Ventolera, Ventisquero, Casablanca', price: '$35.000', active: true, order: 43 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Syrah', name: 'Vetas Blancas, Tabalí, Limarí', price: '$29.000', active: true, order: 44 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Syrah', name: 'Cromas, Los Vascos, Colchagua', price: '$23.000', active: true, order: 45 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Syrah', name: 'Origen, Valle Secreto, Cachapoal', price: '$22.000', active: true, order: 46 },
  // Malbec
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Malbec', name: 'Portillo, Salentein, Mendoza', price: '$25.000', active: true, order: 47 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Malbec', name: 'Callia, Bodegas Callia, San Juan', price: '$20.000', active: true, order: 48 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Malbec', name: 'Loma Larga, Casablanca', price: '$20.000', active: true, order: 49 },
  // Ensamblajes
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'EPU, Almaviva, Maipo', price: '$110.000', active: true, order: 50 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Futa, Calcu, Colchagua', price: '$85.000', active: true, order: 51 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Mixtio, Sutil, Varias zonas', price: '$68.000', active: true, order: 52 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Brisas, Arboleda, Aconcagua', price: '$55.000', active: true, order: 53 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Rapsodia, Loma Larga, Casablanca', price: '$38.500', active: true, order: 54 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Ácrux, Sutil, Colchagua', price: '$38.000', active: true, order: 55 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'The Lost Barrel, Oveja Negra, Maule', price: '$35.000', active: true, order: 56 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Berta, Santa Berta, Itata', price: '$35.000', active: true, order: 57 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Calyptra Fortificado, Calyptra, Cachapoal', price: '$35.000', active: true, order: 58 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Almado, Miguel Torres, Maule', price: '$29.000', active: true, order: 59 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Vetas Blancas, Tabalí, Limarí', price: '$29.000', active: true, order: 60 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Causa, Miguel Torres, Maule', price: '$29.000', active: true, order: 61 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: '700, Andes Plateau, Maipo', price: '$25.000', active: true, order: 62 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Ensamblajes', name: 'Secreto, Valle Secreto, Cachapoal', price: '$20.000', active: true, order: 63 },
  // Vinos memorables
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Chadwick, Cabernet Sauvignon, Maipo', price: '$590.000', active: true, order: 64 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Almaviva, Ensamblaje, Maipo', price: '$350.000', active: true, order: 65 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Don Melchor, Cabernet Sauvignon, Maipo', price: '$330.000', active: true, order: 66 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Seña, Ensamblaje, Aconcagua', price: '$255.000', active: true, order: 67 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Don Maximiano, Ensamblaje, Aconcagua', price: '$250.000', active: true, order: 68 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Clos Apalta, Ensamblaje, Colchagua', price: '$240.000', active: true, order: 69 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Montes Alpha M, Ensamblaje, Colchagua', price: '$210.000', active: true, order: 70 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Carmín de Peumo, Carmenere, Cachapoal', price: '$190.000', active: true, order: 71 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Purple Angel, Carmenere, Colchagua', price: '$160.000', active: true, order: 72 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Rocas de Seña, Ensamblaje, Aconcagua', price: '$150.000', active: true, order: 73 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Kai, Carmenere, Aconcagua', price: '$130.000', active: true, order: 74 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Viola, Carmenere, Colchagua', price: '$120.000', active: true, order: 75 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Franco, Cabernet Franc, Colchagua', price: '$120.000', active: true, order: 76 },
  { restaurant: 'arboleda', category: 'Vinos', subcategory: 'Vinos memorables', name: 'Pizarras, Syrah, Aconcagua', price: '$110.000', active: true, order: 77 },

  // ─── ARBOLEDA – COCTELERÍA INTERNACIONAL ────────────────────────────────────
  // Cítricos
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Margarita', description: 'Don Julio, Gran Manier, jugo de limón.', price: '$9.900', active: true, order: 1 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Pisco Sour', description: 'Gobernador 40°, jugo de limón, sirop de la casa.', price: '$7.500', active: true, order: 2 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Sour Peruano', description: 'Pisco peruano, jugo de limón, sirop de la casa.', price: '$7.500', active: true, order: 3 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Sour Chileno Catedral', description: 'Pisco Gobernador 40°, jugo de limón, sirop de la casa.', price: '$9.990', active: true, order: 4 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Whiskey Sour', description: 'Bourbon Bulleit, jugo de limón, sirop de la casa, dash de angostura.', price: '$9.500', active: true, order: 5 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Cítricos', name: 'Amaretto Sour', description: 'Disaronno Amaretto, Bourbon Bulleit, jugo de limón, jarabe demerara.', price: '$9.000', active: true, order: 6 },
  // Históricos
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Históricos', name: 'Dry Martini', description: 'Gin Tanqueray y Vermouth Dry.', price: '$7.500', active: true, order: 7 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Históricos', name: 'Godfather', description: 'Whisky Grants 12 años, Dissarono Amaretto, dash de angostura.', price: '$8.500', active: true, order: 8 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Históricos', name: 'Manhattan', description: 'Bourbon Bullet, Whisky Jameson, Vermouth Rosso, dash de angostura.', price: '$8.500', active: true, order: 9 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Históricos', name: 'Negroni', description: 'Gin Tanqueray, Campari y Vermouth Rosso.', price: '$8.000', active: true, order: 10 },
  // Dulces y Cremosos
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Dulces y Cremosos', name: 'Carajillo', description: 'Licor 43, café espresso.', price: '$7.500', active: true, order: 11 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Dulces y Cremosos', name: 'Espresso Martini', description: 'Vodka, licor de café Borghetti, café espresso, bitter de cacao.', price: '$7.500', active: true, order: 12 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Dulces y Cremosos', name: 'Piña Colada', description: 'Ron Blanco, Ron Malibú, jugo de piña, crema de coco.', price: '$7.500', active: true, order: 13 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Dulces y Cremosos', name: 'White Russian', description: 'Vodka, crema de leche, licor de café Borghetti.', price: '$7.500', active: true, order: 14 },
  // Refrescantes
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Refrescantes', name: 'Aperol Spritz', description: 'Aperol, espumante de la zona, top soda.', price: '$7.500', active: true, order: 15 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Refrescantes', name: 'Ramazzotti Spritz', description: 'Ramazzotti, espumante de la zona, top soda.', price: '$7.500', active: true, order: 16 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Refrescantes', name: 'Caipiriña', description: 'Cachaca, limón sutil, sirop simple.', price: '$7.500', active: true, order: 17 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Refrescantes', name: 'Mojito', description: 'Ron Blanco, sirop simple, jugo de limón, top soda.', price: '$6.000', active: true, order: 18 },
  { restaurant: 'arboleda', category: 'Coctelería Internacional', subcategory: 'Refrescantes', name: 'Mojito Sabores', description: 'Variedad de sabores, Ron Blanco, sirop simple, jugo de limón, top soda.', price: '$8.000', active: true, order: 19 },

  // ─── ARBOLEDA – DESTILADOS Y LICORES ─────────────────────────────────────────
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Pisco', name: 'Waqar 40° / Kappa 40°', price: '$9.900', active: true, order: 1 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Pisco', name: 'Pisco Mistral Gran Nobel', price: '$8.000', active: true, order: 2 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Pisco', name: 'Gobernador 40°', price: '$5.500', active: true, order: 3 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Pisco', name: 'Pisco Mistral 35°', price: '$5.000', active: true, order: 4 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Whisky', name: 'Chivas Regal 18 años', price: '$17.500', active: true, order: 5 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Whisky', name: 'Chivas Regal 12 años', price: '$8.000', active: true, order: 6 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Whisky', name: "Jack Daniel's (N°7, Apple, Fire, Honney)", price: '$7.000', active: true, order: 7 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Whisky', name: 'Whisky Grants 12 años', price: '$5.000', active: true, order: 8 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Gin', name: 'Ophir', price: '$9.500', active: true, order: 9 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Gin', name: "Hendrick's", price: '$8.500', active: true, order: 10 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Gin', name: 'Tanqueray N° Ten', price: '$8.000', active: true, order: 11 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Gin', name: 'Tanqueray / Tanqueray Royale', price: '$6.000', active: true, order: 12 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Tequila', name: 'Don Julio Reposado', price: '$9.900', active: true, order: 13 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Tequila', name: 'Don Julio Blanco', price: '$7.900', active: true, order: 14 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Tequila', name: 'Mezcal 400 Conejo', price: '$7.000', active: true, order: 15 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Ron', name: 'Zacapa 23 años', price: '$13.500', active: true, order: 16 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Ron', name: 'Bayou Spiced', price: '$8.000', active: true, order: 17 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Vodka', name: 'Absolut Blue', price: '$5.500', active: true, order: 18 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Vodka', name: 'Stoli / Stoli Gluten Free', price: '$5.000', active: true, order: 19 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Licores', name: 'Disaronno / Dissaronno Velvet', price: '$6.000', active: true, order: 20 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Licores', name: 'Baileys / Licor 43 / Jagermeister / Frangelico', price: '$5.500', active: true, order: 21 },
  { restaurant: 'arboleda', category: 'Destilados y Licores', subcategory: 'Licores', name: 'Villa Massa Limoncello / Fernet Branca', price: '$5.000', active: true, order: 22 },

  // ─── ARBOLEDA – OTRAS BEBIDAS ────────────────────────────────────────────────
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cervezas', name: 'Shangri-La / Tamango / Kross / Procer', price: '$5.500', active: true, order: 1 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cervezas', name: 'Kunstmann Torobayo', price: '$5.000', active: true, order: 2 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cervezas', name: 'Heineken / Corona', price: '$4.500', active: true, order: 3 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cervezas Sin Alcohol', name: 'Heineken Cero / Corona Cero', price: '$4.500', active: true, order: 4 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cervezas Sin Alcohol', name: 'Michelada o Chelada', price: '$1.500', active: true, order: 5 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Sin Alcohol', name: 'Virgin Mary / Virgin Colada / Virgin Mojito', price: '$6.800', active: true, order: 6 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Sin Alcohol', name: 'Sweet Russian', price: '$6.500', active: true, order: 7 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Sin Alcohol', name: 'Italian Spritz', price: '$6.000', active: true, order: 8 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Sin Alcohol', name: 'Caipirinha Zero', price: '$5.000', active: true, order: 9 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Sin Alcohol', name: 'Limonada (Tradicional / Menta-Jengibre) / Jugos', price: '$4.500 - $4.900', active: true, order: 10 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Refrescos & Aguas', name: 'Red Bull Variedades', price: '$3.500', active: true, order: 11 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Refrescos & Aguas', name: 'Agua San Pellegrino / Acqua Panna 500cc', price: '$3.200', active: true, order: 12 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Refrescos & Aguas', name: 'Agua Tónica / Bebidas', price: '$2.500', active: true, order: 13 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cafetería', name: 'Mocaccino', price: '$3.800', active: true, order: 14 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cafetería', name: 'Cappuccino / Cortado doble', price: '$3.500', active: true, order: 15 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cafetería', name: 'Americano doble', price: '$3.200', active: true, order: 16 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cafetería', name: 'Cortado simple', price: '$2.900', active: true, order: 17 },
  { restaurant: 'arboleda', category: 'Otras Bebidas', subcategory: 'Cafetería', name: 'Espresso / Ristreto / Lungo / Americano', price: '$1.900 - $2.500', active: true, order: 18 },

  // ─── LA GRIETA – COMIDA ──────────────────────────────────────────────────────
  // Hamburguesas
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Hamburguesa', name: 'Burger de la Casa', description: 'Pan Brioche de papa, triple cheddar, 180 grs. smash, pepinillo.', price: '$13.900', active: true, order: 1 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Hamburguesa', name: 'Beyond Burger', description: 'Vegan Burger, rúcula, duxelle de setas, cebolla asada, salsa de ajo.', price: '$14.900', active: true, order: 2 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Hamburguesa', name: 'Burger Serrano & Azul', description: 'Jamón serrano, mermelada membrillo, queso azul, mostaza Dijon.', price: '$14.900', active: true, order: 3 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Hamburguesa', name: 'Cheese Burger', description: 'Clásica hamburguesa con queso cheddar.', price: '$9.900', active: true, order: 4 },
  // Sandwich
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Sandwich', name: 'Barros Luco', description: 'Filete grillado, queso fundido, mayo merquén en marraqueta.', price: '$8.900', active: true, order: 5 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Sandwich', name: 'Completo Encurtido', description: 'Salchicha artesanal, palta, relish pepino, mayo-ajo en pan Nan/Brioche.', price: '$7.900', active: true, order: 6 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Sandwich', name: 'Don Panchito', description: 'Filete de pollo, queso, salsa macha, choclo y pebre en marraqueta.', price: '$6.990', active: true, order: 7 },
  // Pizza
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Pizza', name: 'Pizza Camarón', description: 'Masa de pizza, mozzarella, salsa de tomate, camarón, aceite de ajo.', price: '$13.990', active: true, order: 8 },
  // Fast Food
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Fast Food', name: 'Papas Fritas', description: 'Tradicionales sazonadas con sal (Medianas / Grandes).', price: '$4.900 / $5.900', active: true, order: 9 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Fast Food', name: 'Papas Cheddar', description: 'Con salsa cheddar, tocino crocante y perejil.', price: '$6.900', active: true, order: 10 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Fast Food', name: 'Empanadas de Queso', description: '6 unidades fritas acompañadas de pebre.', price: '$8.900', active: true, order: 11 },
  // Tablas
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Tablas', name: 'Mar y Tierra', description: 'Base de papas, lomo res, pollo, navajuelas, ostiones y camarones.', price: '$23.500', active: true, order: 12 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Tablas', name: 'Tabla de Empanadas', description: '16 unidades de empanadas de la casa al horno.', price: '$9.500', active: true, order: 13 },
  // Ensaladas
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Ensaladas', name: 'Ensalada del Chef', description: 'Hojas verdes, jamón serrano, aceto miel, frutillas y mozzarella.', price: '$9.900', active: true, order: 14 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Ensaladas', name: 'Ensalada César', description: 'Pollo grillado, hojas verdes, anchoas, crutones y palta.', price: '$8.900', active: true, order: 15 },
  { restaurant: 'lagrieta', category: 'Comida', subcategory: 'Ensaladas', name: 'Ensalada de Frutas', description: 'Mix de frutas frescas de la estación.', price: '$5.900', active: true, order: 16 },

  // ─── LA GRIETA – COCTELERÍA ──────────────────────────────────────────────────
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Cítricos', name: 'Margarita', description: 'Don Julio, Gran Manier, jugo de limón.', price: '$9.900', active: true, order: 1 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Cítricos', name: 'Chardonnay Sour', description: 'Chardonnay, limón natural, sirop de la casa.', price: '$7.500', active: true, order: 2 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Cítricos', name: 'Pisco Sour', description: 'Gobernador 40°, jugo de limón, sirop.', price: '$7.500', active: true, order: 3 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Históricos', name: 'Godfather', description: 'Whisky Grants 12 años, Dissarono Amaretto, angostura.', price: '$8.500', active: true, order: 4 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Históricos', name: 'Negroni', description: 'Gin Tanqueray, Campari y Vermuth Rosso.', price: '$8.000', active: true, order: 5 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Históricos', name: 'Old Fashioned', description: 'Bourbon Bullet, Grants 12 años, jarabe Demerara, angostura.', price: '$8.500', active: true, order: 6 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Autor', name: 'Carpintero', description: 'Pisco, licor de mora/boysenberry, limón, agua de rosas.', price: '$10.900', active: true, order: 7 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Autor', name: 'Fuego & Flor', description: 'Gin, Vermut Rosso, Campari, rosa mosqueta, ahumado de pino.', price: '$9.900', active: true, order: 8 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Autor', name: 'Fresco del Valle', description: 'Pisco, Trakal, piña, limón, sirop de romero.', price: '$12.500', active: true, order: 9 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Dulces & Cremosos', name: 'Carajillo', description: 'Licor 43, café espresso.', price: '$7.500', active: true, order: 10 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Dulces & Cremosos', name: 'Espresso Martini', description: 'Vodka, licor café Borghetti, espresso, bitter cacao.', price: '$7.500', active: true, order: 11 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Refrescantes', name: 'Aperol Spritz', description: 'Aperol, espumante de la zona, top soda.', price: '$7.900', active: true, order: 12 },
  { restaurant: 'lagrieta', category: 'Coctelería', subcategory: 'Refrescantes', name: 'Moscow Mule', description: 'Vodka, jugo de limón natural, Ginger Beer.', price: '$8.500', active: true, order: 13 },

  // ─── LA GRIETA – DESTILADOS Y LICORES ───────────────────────────────────────
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Pisco', name: 'Waqar 40° / Bou Legado', price: '$5.500 a $9.900', active: true, order: 1 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Whisky', name: 'J.W. Blue Label / Akashi / Chivas 18 / Jack Daniel\'s', price: '$5.000 a $55.000', active: true, order: 2 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Cognac & Brandy', name: 'Hennessy XO / Carlos I', price: '$22.500 a $67.900', active: true, order: 3 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Gin', name: 'Mary Le Bone / Hendrick\'s / Tanqueray', price: '$6.000 a $14.500', active: true, order: 4 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Tequila', name: 'Don Julio Reposado / Mezcal 400 conejo', price: '$7.000 a $9.900', active: true, order: 5 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Ron', name: 'Zacapa XO / Havana 7 años / Ron Kraken', price: '$6.000 a $25.900', active: true, order: 6 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Vodka', name: 'Grey Goose / Belvedere / Stoli', price: '$5.000 a $9.900', active: true, order: 7 },
  { restaurant: 'lagrieta', category: 'Destilados y Licores', subcategory: 'Licores', name: 'Jagermeister / Grand Marnier / Baileys / Trä Kal', price: '$5.000 a $9.000', active: true, order: 8 },

  // ─── LA GRIETA – BEBIDAS CON Y SIN ALCOHOL ──────────────────────────────────
  { restaurant: 'lagrieta', category: 'Bebidas con y sin Alcohol', subcategory: 'Vinos Espumosos', name: 'Moet Chandon Brut / Estelado Rose', price: '$19.500 a $158.000', active: true, order: 1 },
  { restaurant: 'lagrieta', category: 'Bebidas con y sin Alcohol', subcategory: 'Cervezas', name: 'Kunstmann / Tamango / Shangrila / Prócer / Kross', price: '$4.500 a $6.500', active: true, order: 2 },
  { restaurant: 'lagrieta', category: 'Bebidas con y sin Alcohol', subcategory: 'Cervezas sin Alcohol', name: 'Heineken Cero / Corona Cero', price: '$4.500', active: true, order: 3 },
  { restaurant: 'lagrieta', category: 'Bebidas con y sin Alcohol', subcategory: 'Sin Alcohol', name: 'Virgin Mary / Virgin Colada / Limonadas / Jugos', price: '$4.500 a $6.800', active: true, order: 4 },
  { restaurant: 'lagrieta', category: 'Bebidas con y sin Alcohol', subcategory: 'Refrescos y Aguas', name: 'Red Bull / San Pellegrino / Bebidas', price: '$1.900 a $3.500', active: true, order: 5 },

  // ─── MUFFIN CAFÉ – PASTELERÍA ────────────────────────────────────────────────
  { restaurant: 'muffin', category: 'Pastelería', subcategory: null, name: 'Barra de proteína', price: '$3.500', active: true, order: 1 },
  { restaurant: 'muffin', category: 'Pastelería', subcategory: null, name: 'Muffin variedades', price: '$3.200', active: true, order: 2 },
  { restaurant: 'muffin', category: 'Pastelería', subcategory: null, name: 'Galletón variedades', price: '$2.500', active: true, order: 3 },
  { restaurant: 'muffin', category: 'Pastelería', subcategory: null, name: 'Masa Danesa Rellena de crema', price: '$2.500', active: true, order: 4 },
  { restaurant: 'muffin', category: 'Pastelería', subcategory: null, name: 'Donuts variedad sabores', price: '$1.800', active: true, order: 5 },

  // ─── MUFFIN CAFÉ – BEBIDAS CALIENTES ────────────────────────────────────────
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Chocolate caliente', price: '$4.900', active: true, order: 1 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Moccaccino', price: '$3.900', active: true, order: 2 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café expreso doble', price: '$3.400', active: true, order: 3 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café latte', price: '$3.400', active: true, order: 4 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café cortado', price: '$3.200', active: true, order: 5 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café capucchino', price: '$3.200', active: true, order: 6 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Infusiones', price: '$3.000', active: true, order: 7 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café macchiato', price: '$2.800', active: true, order: 8 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Lungo', price: '$2.400', active: true, order: 9 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café americano', price: '$2.300', active: true, order: 10 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Ristretto', price: '$2.300', active: true, order: 11 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Café expreso simple', price: '$2.200', active: true, order: 12 },
  { restaurant: 'muffin', category: 'Bebidas calientes', subcategory: null, name: 'Té variedades', price: '$2.000', active: true, order: 13 },

  // ─── MUFFIN CAFÉ – BEBIDAS FRÍAS ────────────────────────────────────────────
  { restaurant: 'muffin', category: 'Bebidas frías', subcategory: null, name: 'RedBull variedades', price: '$3.500', active: true, order: 1 },
  { restaurant: 'muffin', category: 'Bebidas frías', subcategory: null, name: 'Acqua Panna 500 cc', price: '$3.200', active: true, order: 2 },
  { restaurant: 'muffin', category: 'Bebidas frías', subcategory: null, name: 'San Pellegrino 500 cc', price: '$3.200', active: true, order: 3 },
  { restaurant: 'muffin', category: 'Bebidas frías', subcategory: null, name: 'Bebidas lata variedades', price: '$2.500', active: true, order: 4 },
  { restaurant: 'muffin', category: 'Bebidas frías', subcategory: null, name: 'Vitamin water', price: '$1.900', active: true, order: 5 },
];

async function main() {
  console.log('Eliminando ítems de restaurantes existentes...');
  await db.delete(restaurantItems);
  console.log('Ítems eliminados.');

  console.log('Insertando nuevos ítems...');
  const result = await db.insert(restaurantItems).values(items).returning();
  console.log(`✅ Insertados ${result.length} ítems de restaurantes.`);

  const byRestaurant = result.reduce((acc, i) => {
    acc[i.restaurant] = (acc[i.restaurant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [rest, count] of Object.entries(byRestaurant)) {
    console.log(`  - ${rest}: ${count}`);
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
