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
import { familyPrograms } from '../lib/db/schema';

const items: (typeof familyPrograms.$inferInsert)[] = [

  // ─── Programas permanentes (tipo club) ────────────────────────────────────
  {
    type: 'club',
    name: 'Club de la Montaña',
    description: 'Programa con actividades recreativas y educativas enfocadas en la exploración, el juego y la conexión con la naturaleza. Desde los 7 años de edad.',
    season: null,
    active: true,
    order: 1,
  },
  {
    type: 'club',
    name: 'Mini Kids Club',
    description: 'Sala de Actividades segura, enfocadas a la exploración y descubrimiento libre, supervisado por educadoras de párvulo. Desde los 4 años hasta los 7 años de edad.',
    schedule: '08:30 – 19:00 | Lunes a domingo',
    season: null,
    active: true,
    order: 2,
  },
  {
    type: 'club',
    name: 'Salón de Juegos',
    description: 'Espacio de entretención y recreación para toda la familia.',
    schedule: '08:30 – 23:30',
    season: null,
    active: true,
    order: 3,
  },

  // ─── Guardería ─────────────────────────────────────────────────────────────
  {
    type: 'guarderia',
    name: 'Guardería',
    description: 'Servicio para niños/as de 3 a 7 años con control de esfínter.\n\nReglamento:\n\n1. Edad y supervisión\nServicio para niños/as de 3 a 7 años con control de esfínter.\nMenores de 3 años deben estar siempre con un adulto (opción de babysitter disponible).\n\n2. Ingreso y retiro\nSiempre con un adulto responsable.\nSe debe firmar ingreso y entregar información actualizada (salud, alergias, contacto).\nMantener teléfono disponible ante emergencias.\nAnte cualquier situación, el equipo contactará al adulto registrado.\n\n3. Bienestar\nLa permanencia debe ser voluntaria.\nNo se permite consumo de alimentos dentro del recinto.\n\n4. Autonomía\nNiños/as deben ser autónomos en el uso del baño (educadoras solo acompañan).\n\n5. Uso de espacios y materiales\nJuguetes permanecen en la guardería (solo se llevan manualidades).\nEspacios y mobiliario son de uso preferente de los niños/as.\nAdultos pueden acompañar en zonas habilitadas.\n\n6. Convivencia\nCaminar dentro del espacio y jugar de forma respetuosa.\nCuidar y ordenar materiales.\nRespetar a otros niños/as, especialmente a los más pequeños.\nUsar juegos y estructuras de forma segura.',
    schedule: 'Lun–Sáb: 08:30–18:30 | Dom: 08:30–16:30',
    season: null,
    active: true,
    order: 1,
  },

  // ─── Actividades por temporada – VERANO ────────────────────────────────────
  {
    type: 'actividad',
    name: 'Canopy Infantil',
    description: 'Actividad de tirolesa diseñada para niños, combinando aventura y seguridad en un entorno controlado.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 6 niños por guía',
    season: 'verano',
    active: true,
    order: 1,
  },
  {
    type: 'actividad',
    name: 'Granja Educativa',
    description: 'Experiencia interactiva donde los niños pueden conocer y compartir con animales de granja.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: Sin límite de participantes',
    season: 'verano',
    active: true,
    order: 2,
  },
  {
    type: 'actividad',
    name: 'Caminata Nocturna',
    description: 'Exploración guiada del bosque cercano al hotel en horario nocturno, utilizando linternas.\nDuración: 1,5 horas\nAltitud: 1.600 msnm\nDificultad: Fácil\nDistancia: 1,6 km\nCapacidad: 8 pasajeros por guía',
    season: 'verano',
    active: true,
    order: 3,
  },
  {
    type: 'actividad',
    name: 'Gruta los Pangues',
    description: 'Sendero fácil y apto para todo público que lleva a una gruta en medio de la naturaleza.\nDuración: 3 horas\nAltitud: 1.200 msnm\nDificultad: Fácil\nDistancia: 2 km\nCapacidad: 8 pasajeros por guía',
    season: 'verano',
    active: true,
    order: 4,
  },
  {
    type: 'actividad',
    name: 'Tour Astronómico',
    description: 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 16 pasajeros',
    season: 'verano',
    active: true,
    order: 5,
  },
  {
    type: 'actividad',
    name: 'Taller de Arte',
    description: 'Espacio creativo familiar enfocado en la exploración artística inspirada en la naturaleza.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    season: 'verano',
    active: true,
    order: 6,
  },
  {
    type: 'actividad',
    name: 'Taller de Cocina',
    description: 'Actividad culinaria familiar donde aprenderás a preparar y hornear distintas recetas.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes',
    season: 'verano',
    active: true,
    order: 7,
  },
  {
    type: 'actividad',
    name: 'Muro de Escalada',
    description: 'Actividad guiada para desarrollar fuerza, coordinación y confianza en un entorno seguro.',
    season: 'verano',
    active: true,
    order: 8,
  },
  {
    type: 'actividad',
    name: 'Juegos en la Piscina',
    description: 'Espacio recreativo con actividades acuáticas grupales, ideal para entretención y movimiento.',
    season: 'verano',
    active: true,
    order: 9,
  },
  {
    type: 'actividad',
    name: 'Talleres de Manualidades',
    description: 'Instancias creativas para explorar, aprender y desarrollar habilidades a través del juego.',
    season: 'verano',
    active: true,
    order: 10,
  },
  {
    type: 'actividad',
    name: 'Deportes en Dependencias',
    description: 'Acceso a espacios deportivos del hotel para actividades recreativas y de libre uso.',
    season: 'verano',
    active: true,
    order: 11,
  },

  // ─── Actividades por temporada – INVIERNO ──────────────────────────────────
  {
    type: 'actividad',
    name: 'Tour Astronómico',
    description: 'Experiencia nocturna con introducción a la astronomía y observación de astros mediante telescopio.\nDuración: 1 hora\nAltitud: 1.600 msnm\nDificultad: Fácil\nCapacidad: 16 pasajeros',
    season: 'invierno',
    active: true,
    order: 1,
  },
  {
    type: 'actividad',
    name: 'Taller de Arte',
    description: 'Espacio creativo familiar enfocado en la exploración artística inspirada en la naturaleza.\nDuración: 1 hora\nCapacidad: 16 participantes',
    season: 'invierno',
    active: true,
    order: 2,
  },
  {
    type: 'actividad',
    name: 'Taller de Pizza',
    description: 'Actividad culinaria familiar donde conocerás los orígenes de la pizza y aprenderás a preparar tu propia pizza a la piedra junto a un experto.\nDuración: 1 hora\nDificultad: Fácil\nCapacidad: 16 participantes\nDías: Jueves y sábado',
    season: 'invierno',
    active: true,
    order: 3,
  },
  {
    type: 'actividad',
    name: 'Juegos en la Piscina',
    description: 'Espacio recreativo con actividades acuáticas grupales, ideal para entretención y movimiento.',
    season: 'invierno',
    active: true,
    order: 4,
  },
  {
    type: 'actividad',
    name: 'Talleres de Manualidades',
    description: 'Instancias creativas para explorar, aprender y desarrollar habilidades a través del juego.',
    season: 'invierno',
    active: true,
    order: 5,
  },
  {
    type: 'actividad',
    name: 'Deportes en Dependencias',
    description: 'Acceso a espacios deportivos del hotel para actividades recreativas y de libre uso.',
    season: 'invierno',
    active: true,
    order: 6,
  },
];

async function main() {
  console.log('Eliminando programas familia existentes...');
  await db.delete(familyPrograms);

  console.log('Insertando nuevos datos...');
  const result = await db.insert(familyPrograms).values(items).returning();
  console.log(`✅ Insertados ${result.length} registros.`);

  const summary = result.reduce((acc, r) => {
    const key = `${r.type}${r.season ? ' / ' + r.season : ''}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  ${k}: ${v}`);
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
