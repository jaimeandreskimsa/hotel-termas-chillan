import { db } from '../lib/db/index';
import { activities } from '../lib/db/schema';

async function main() {
  const items = [
    {
      season: 'verano',
      category: 'Otras Actividades',
      name: 'Canchas de Tenis',
      description: 'Canchas de tenis disponibles para todos los huéspedes del hotel.\nEquipos disponibles en recepción.\nReserva en recepción o anexo 3540.',
      price: null as null,
      image: null as null,
      order: 1,
      active: true,
    },
    {
      season: 'verano',
      category: 'Otras Actividades',
      name: 'Granja Educativa',
      description: 'Experiencia interactiva donde niños y adultos conocen y comparten con animales de granja.\nDuración: 1 hora.',
      price: null as null,
      image: null as null,
      order: 2,
      active: true,
    },
    {
      season: 'verano',
      category: 'Otras Actividades',
      name: 'Cabalgatas',
      description: 'Paseo a caballo por los senderos del entorno del hotel, con guía especializado.\nDuración: 1 hora\nConsultar en recepción.',
      price: 'Con costo adicional',
      image: null as null,
      order: 3,
      active: true,
    },
    {
      season: 'invierno',
      category: 'Otras Actividades',
      name: 'Canchas de Tenis',
      description: 'Canchas de tenis disponibles para todos los huéspedes del hotel.\nEquipos disponibles en recepción.\nReserva en recepción o anexo 3540.',
      price: null as null,
      image: null as null,
      order: 1,
      active: true,
    },
  ];

  const res = await db.insert(activities).values(items).returning();
  console.log('Inserted:', res.length, 'activities');
  for (const r of res) {
    console.log(' -', r.season, '|', r.category, '|', r.name);
  }
}

main().catch(console.error);
