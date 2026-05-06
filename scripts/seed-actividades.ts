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
import { activities } from '../lib/db/schema';

const items: (typeof activities.$inferInsert)[] = [

  // ─── VERANO – Caminatas y Trekkings ─────────────────────────────────────────
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Fumarolas',
    description: 'Caminata desde el hotel hacia zonas de altura, atravesando bosque nativo hasta llegar a impresionantes fumarolas volcánicas.\nDuración: 3 horas\nAltitud: 2.300 msnm\nDificultad: Media / Alta\nDistancia: 5 km\nCapacidad: 8 pasajeros por guía',
    active: true, order: 1,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Rukapiren',
    description: 'Ruta en medio de bosque nativo que conduce hasta una cascada de 50 metros. Ideal para quienes buscan una caminata escénica y accesible.\nDuración: 3 horas\nAltitud: 1.000 msnm\nDificultad: Media\nDistancia: 4 km\nCapacidad: 8 pasajeros por guía',
    active: true, order: 2,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'El Regalo',
    description: 'Caminata desde el hotel hacia la ruta de las cascadas, finalizando en el mirador El Regalo, con vistas panorámicas del entorno.\nDuración: 3 horas\nAltitud: 1.300 msnm\nDificultad: Media\nCapacidad: 8 pasajeros por guía',
    active: true, order: 3,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Gruta los Pangues',
    description: 'Sendero fácil y apto para todo público que lleva a una gruta en medio de la naturaleza.\nDuración: 3 horas\nAltitud: 1.200 msnm\nDificultad: Fácil\nDistancia: 2 km\nCapacidad: 8 pasajeros por guía',
    active: true, order: 4,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Shangrila',
    description: 'Recorrido por bosque nativo hasta un escorial de lava, testimonio de antiguas erupciones volcánicas.\nDuración: 3 horas\nAltitud: 1.550 msnm\nDificultad: Media\nCapacidad: 8 pasajeros por guía',
    active: true, order: 5,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Caminata Nocturna',
    description: 'Exploración guiada del bosque cercano al hotel en horario nocturno, utilizando linternas.\nDuración: 1,5 horas\nAltitud: 1.600 msnm\nDificultad: Fácil\nDistancia: 1,6 km\nCapacidad: 8 pasajeros por guía',
    active: true, order: 6,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Laguna el Huemul (Full Day)',
    description: 'Trekking de alta exigencia que atraviesa bosques y terreno volcánico hasta llegar a una laguna de montaña.\nDuración: 8 horas\nAltitud: 2.000 msnm\nDificultad: Alta\nDistancia: 15 km\nCapacidad: 8 pasajeros por guía\nLas actividades full day son operadas por proveedor externo y tienen costo adicional.',
    active: true, order: 7,
  },
  {
    season: 'verano',
    category: 'Caminatas y Trekkings',
    name: 'Aguas Calientes (Full Day)',
    description: 'Ruta de alta montaña que culmina en un valle con aguas termales naturales, ideal para combinar trekking y relajo.\nDuración: 8 horas\nAltitud: 2.400 msnm\nDificultad: Alta\nDistancia: 10 km\nCapacidad: 8 pasajeros por guía\nLas actividades full day son operadas por proveedor externo y tienen costo adicional.',
    active: true, order: 8,
  },

  // ─── VERANO – Bicicleta ──────────────────────────────────────────────────────
  {
    season: 'verano',
    category: 'Bicicleta',
    name: 'Los Coltrahues',
    description: 'Recorrido suave por senderos rodeados de naturaleza, con vistas al valle Las Trancas y presencia de flora y fauna local. Ideal para todos los niveles.\nDuración: 3 horas\nAltitud: 1.200 msnm\nDificultad: Fácil\nDistancia: 9 km\nCapacidad: 6 pasajeros por guía',
    active: true, order: 1,
  },
  {
    season: 'verano',
    category: 'Bicicleta',
    name: 'Rukapiren',
    description: 'Ruta en bicicleta a través de bosque nativo que conduce hasta la cascada Rukapirén, con una caída de aproximadamente 50 metros.\nDuración: 3 horas\nAltitud: 1.200 msnm\nDificultad: Fácil\nDistancia: 5 km\nCapacidad: 6 pasajeros por guía',
    active: true, order: 2,
  },
  {
    season: 'verano',
    category: 'Bicicleta',
    name: 'Shangrila',
    description: 'Recorrido que combina bosque nativo y paisajes volcánicos, llegando a zonas de escorial de lava. Una experiencia más exigente y diversa.\nDuración: 3 horas\nAltitud: 1.550 msnm\nDificultad: Media / Alta\nCapacidad: 6 pasajeros por guía',
    active: true, order: 3,
  },
  {
    season: 'verano',
    category: 'Bicicleta',
    name: 'Refugio Garganta del Diablo',
    description: 'Ruta más extensa que atraviesa bosque centenario y arenales volcánicos hasta un refugio con vista panorámica privilegiada.\nDuración: 5 horas\nAltitud: 1.920 msnm\nDificultad: Alta\nDistancia: 7 km\nCapacidad: 6 pasajeros por guía',
    active: true, order: 4,
  },
  {
    season: 'verano',
    category: 'Bicicleta',
    name: 'Bike Park Nevados',
    description: 'Parque de ciclismo de montaña con pistas de distintos niveles, desde principiantes hasta expertos. Ideal para descensos en un entorno de montaña único.\nDuración: Libre dentro de horario operativo\nAltitud: 1.500 – 1.800 msnm\nDificultad: Variable (según pista)\nHorario: 10:00 a 17:00',
    active: true, order: 5,
  },

  // ─── VERANO – Contemplación y Recreación ────────────────────────────────────
  {
    season: 'verano',
    category: 'Contemplación y Recreación',
    name: 'Observación de Aves y Fauna',
    description: 'Actividad guiada en el entorno del bosque para aprender a identificar especies y conectar con la biodiversidad local.\nDuración: 2 horas\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 8 pasajeros por guía',
    active: true, order: 1,
  },
  {
    season: 'verano',
    category: 'Contemplación y Recreación',
    name: 'Tour Astronómico',
    description: 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 16 pasajeros',
    active: true, order: 2,
  },
  {
    season: 'verano',
    category: 'Contemplación y Recreación',
    name: 'Arborismo',
    description: 'Circuito de aventura en altura con plataformas y puentes colgantes entre árboles, en un entorno natural seguro.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 6 pasajeros por guía',
    active: true, order: 3,
  },
  {
    season: 'verano',
    category: 'Contemplación y Recreación',
    name: 'Canopy Infantil',
    description: 'Actividad de tirolesa diseñada para niños, combinando aventura y seguridad en un entorno controlado.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 6 niños por guía',
    active: true, order: 4,
  },
  {
    season: 'verano',
    category: 'Contemplación y Recreación',
    name: 'Granja Educativa',
    description: 'Experiencia interactiva donde los niños pueden conocer y compartir con animales de granja.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: Sin límite de participantes',
    active: true, order: 5,
  },

  // ─── VERANO – Bienestar y Talleres ──────────────────────────────────────────
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Activación Corporal',
    description: 'Sesión guiada para comenzar el día activando el cuerpo y fortaleciendo músculos.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    active: true, order: 1,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Yoga',
    description: 'Práctica que conecta cuerpo, respiración y mente, mejorando flexibilidad y equilibrio.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    active: true, order: 2,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Aquagym',
    description: 'Ejercicios en el agua que combinan actividad aeróbica y resistencia de bajo impacto.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 16 participantes',
    active: true, order: 3,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Música en Vivo / Karaoke',
    description: 'Actividad nocturna en el Bar La Grieta del hotel con música en vivo y espacios de entretenimiento.\nJueves, viernes y sábado en bar la grieta desde las 22:00.',
    active: true, order: 4,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Taller de Arte',
    description: 'Espacio creativo familiar enfocado en la exploración artística inspirada en la naturaleza.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    active: true, order: 5,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Taller de Coctelería',
    description: 'Experiencia guiada para aprender técnicas básicas de coctelería y degustar preparaciones.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    active: true, order: 6,
  },
  {
    season: 'verano',
    category: 'Bienestar y Talleres',
    name: 'Taller de Pizza',
    description: 'Actividad culinaria familiar donde conocerás los orígenes de la pizza y aprenderás a preparar tu propia pizza a la piedra junto a un experto.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes\nDías: Jueves y sábado',
    active: true, order: 7,
  },

  // ─── VERANO – Otras Actividades ─────────────────────────────────────────────
  {
    season: 'verano',
    category: 'Otras Actividades',
    name: 'Gratuitas',
    description: 'Acceso a espacios deportivos y recreativos en las dependencias del hotel.\n• Canchas de tennis\n• Baby futbol\n• Paddleboard piscina',
    active: true, order: 1,
  },
  {
    season: 'verano',
    category: 'Otras Actividades',
    name: 'Con costo extra',
    description: 'Experiencias para explorar el entorno.\n• Cabalgatas\n• Paseo Viña Santa Berta\n• Paseos en buggy',
    active: true, order: 2,
  },

  // ─── INVIERNO – SKI – Precios renta ─────────────────────────────────────────
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo completo ski/snow hi performance',
    price: '$56.000 / USD 71',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo completo ski/snow gama normal',
    price: '$52.000 / USD 65',
    active: true, order: 2,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo completo ski/snow niño',
    price: '$44.000 / USD 55',
    active: true, order: 3,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo por separado ski/snow hi performance',
    price: '$48.000 / USD 60',
    active: true, order: 4,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo por separado ski/snow',
    price: '$40.000 / USD 50',
    active: true, order: 5,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Equipo por separado ski/snow niño',
    price: '$36.000 / USD 45',
    active: true, order: 6,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Bota',
    price: '$44.000 / USD 55',
    active: true, order: 7,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Bota niño',
    price: '$36.000 / USD 45',
    active: true, order: 8,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Casco',
    price: '$24.000 / USD 30',
    active: true, order: 9,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta por Día',
    name: 'Casco niño',
    price: '$20.000 / USD 25',
    active: true, order: 10,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo completo ski/snow hi performance',
    price: '$236.000 / USD 295',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo completo ski/snow gama normal',
    price: '$216.000 / USD 270',
    active: true, order: 2,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo completo ski/snow niño',
    price: '$200.000 / USD 250',
    active: true, order: 3,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo por separado ski/snow hi performance',
    price: '$188.000 / USD 235',
    active: true, order: 4,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo por separado ski/snow gama normal',
    price: '$168.000 / USD 210',
    active: true, order: 5,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Equipo por separado ski/snow niño',
    price: '$144.000 / USD 180',
    active: true, order: 6,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Bota semana',
    price: '$128.000 / USD 160',
    active: true, order: 7,
  },
  {
    season: 'invierno',
    category: 'SKI – Renta Semanal',
    name: 'Bota niño semana',
    price: '$112.000 / USD 140',
    active: true, order: 8,
  },
  {
    season: 'invierno',
    category: 'SKI – Servicios',
    name: 'Encerado',
    price: '$28.000 / USD 35',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'SKI – Servicios',
    name: 'Afilado de cantos',
    price: '$28.000 / USD 35',
    active: true, order: 2,
  },
  {
    season: 'invierno',
    category: 'SKI – Servicios',
    name: 'Cofix',
    price: '$28.000 / USD 35',
    active: true, order: 3,
  },
  {
    season: 'invierno',
    category: 'SKI – Servicios',
    name: 'Reposición de bastón',
    price: '$24.000 / USD 30',
    active: true, order: 4,
  },

  // ─── INVIERNO – Deportes de nieve ────────────────────────────────────────────
  {
    season: 'invierno',
    category: 'Deportes de nieve',
    name: 'Ski y Snowboard',
    description: 'Disfruta de la nieve en pistas de nivel internacional, ideales tanto para principiantes como expertos.\nDuración: Libre\nAltitud: 1.540 – 2.400 msnm\nDificultad: Todas las categorías',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'Deportes de nieve',
    name: 'Motos de Nieve',
    description: 'Recorre paisajes nevados a través de bosques y laderas en una experiencia llena de adrenalina y velocidad.',
    active: true, order: 2,
  },
  {
    season: 'invierno',
    category: 'Deportes de nieve',
    name: 'Heli-Ski',
    description: 'Accede a cumbres remotas en helicóptero y desciende por nieve virgen fuera de pista. Una experiencia exclusiva para los amantes de la montaña y la adrenalina.',
    active: true, order: 3,
  },

  // ─── INVIERNO – Exploración & Naturaleza ────────────────────────────────────
  {
    season: 'invierno',
    category: 'Exploración & Naturaleza',
    name: 'Caminatas con Raquetas (Día)',
    description: 'Recorridos guiados por bosques nevados que permiten explorar la montaña de forma accesible y segura, conectando con el entorno natural.',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'Exploración & Naturaleza',
    name: 'Caminatas con Raquetas (Noche)',
    description: 'Experiencia nocturna en la nieve que permite descubrir el paisaje bajo una atmósfera única, ideal para quienes buscan algo diferente.',
    active: true, order: 2,
  },

  // ─── INVIERNO – Bienestar e Indoor ──────────────────────────────────────────
  {
    season: 'invierno',
    category: 'Bienestar e Indoor',
    name: 'Piscina Temperada',
    description: 'Relájate en piscinas de aguas termales provenientes de la montaña, con temperaturas diseñadas para el descanso y la recuperación.',
    active: true, order: 1,
  },
  {
    season: 'invierno',
    category: 'Bienestar e Indoor',
    name: 'Spa y Wellness',
    description: 'Espacio integral de bienestar con tratamientos, sauna, baños de vapor y experiencias diseñadas para la relajación y recuperación en altura.',
    active: true, order: 2,
  },
  {
    season: 'invierno',
    category: 'Bienestar e Indoor',
    name: 'Yoga y Activación Física',
    description: 'Actividades guiadas que combinan movimiento, respiración y conexión con el entorno, ideales para comenzar o cerrar el día en equilibrio.',
    active: true, order: 3,
  },
];

async function main() {
  console.log('Eliminando actividades existentes...');
  await db.delete(activities);

  console.log('Insertando nuevas actividades...');
  const result = await db.insert(activities).values(items).returning();
  console.log(`✅ Insertadas ${result.length} actividades.`);

  const bySeasonCat = result.reduce((acc, a) => {
    const key = `${a.season} | ${a.category}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [k, v] of Object.entries(bySeasonCat)) {
    console.log(`  ${k}: ${v}`);
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
