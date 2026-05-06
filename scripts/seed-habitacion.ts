import { readFileSync } from 'fs';
import { resolve } from 'path';
// Cargar .env.local ANTES de importar db (necesario porque los imports se hoizan en CJS pero db lee DATABASE_URL al inicializarse)
try {
  const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
  }
} catch {}
// Verificar que apunta al DB correcto
if (!process.env.DATABASE_URL?.includes('5436')) {
  console.error('❌ DATABASE_URL no apunta al puerto 5436 (hoteltermas-db). Abortando.');
  process.exit(1);
}

import { db } from '../lib/db/index';
import { roomInfo } from '../lib/db/schema';
import { inArray } from 'drizzle-orm';

const SECTIONS_TO_REPLACE = ['housekeeping', 'lavanderia', 'emergencia', 'caja', 'protocolo', 'convivencia'];

const items: (typeof roomInfo.$inferInsert)[] = [
  // ─── Housekeeping ──────────────────────────────────────────────────────────
  {
    section: 'housekeeping',
    title: 'Housekeeping',
    content: 'Horario: 08:30 a 23:00 hrs\n\nNuestro equipo de mucamas está disponible para mantener tu habitación en perfectas condiciones durante tu estadía.',
    active: true,
    order: 1,
  },

  // ─── Lavandería ────────────────────────────────────────────────────────────
  {
    section: 'lavanderia',
    title: 'Lavandería',
    content: 'Horario: 08:30 a 16:00 hrs',
    active: true,
    order: 1,
  },
  {
    section: 'lavanderia',
    title: 'Lavado – Hombre',
    content: 'Camisa\nCamisetas\nCalzoncillos\nCalcetines (1 par)\nPañuelos\nPijama\nPantalones Cortos\nPantalones\nPoleras\nPantalón Ski\nBuzo completo Ski\nBuzo deportivo\nSweaters',
    active: true,
    order: 2,
  },
  {
    section: 'lavanderia',
    title: 'Lavado – Mujer',
    content: 'Blusas\nCamisas\nCalzones\nSostenes\nMedias\nPañuelos\nFalda\nVestido\nCamisones\nPijamas\nPantalones\nPantalón Ski\nParka\nSweaters\nBuzo completo Ski\nBuzo deportivo',
    active: true,
    order: 3,
  },
  {
    section: 'lavanderia',
    title: 'Planchado',
    content: 'Camisas\nBlusas\nPantalones\nFaldas\nPoleras\nVestidos / Dresses\nTrajes / Suits',
    active: true,
    order: 4,
  },

  // ─── Emergencia ────────────────────────────────────────────────────────────
  {
    section: 'emergencia',
    title: 'Emergencias Médicas',
    content: 'Asistencia 24/7: Si requiere atención médica, puede comunicarse con recepción marcando al anexo 3500 desde su habitación.\n\nContacto externo: Si se encuentra fuera de las instalaciones del hotel, puede llamar al número +562 2322 3500.',
    active: true,
    order: 1,
  },

  // ─── Caja de Seguridad ─────────────────────────────────────────────────────
  {
    section: 'caja',
    title: 'Caja de Seguridad',
    content: 'Cada habitación dispone de una caja de seguridad para el resguardo de objetos de valor.\n\nAsistencia técnica: En caso de tener inconvenientes con la clave de acceso, debe contactar a recepción para recibir ayuda del personal técnico y de seguridad.',
    active: true,
    order: 1,
  },

  // ─── Protocolos ────────────────────────────────────────────────────────────
  {
    section: 'protocolo',
    title: 'Seguridad',
    content: 'Detección y Alerta: Las emergencias se notificarán mediante una alarma sonora o a través de una llamada directa desde el lobby del hotel.\n\nInstrucciones Generales: Mantenga la calma en todo momento y evite correr. Siga estrictamente las indicaciones del personal capacitado. No utilice su teléfono móvil mientras se desplaza hacia las zonas seguras para prevenir congestiones.\n\nVías de Escape: En el interior de la puerta de cada habitación se encuentra un plano detallado con las vías de escape y zonas seguras debidamente señalizadas.\n\nUso de Ascensores: Durante incendios o sismos, está estrictamente prohibido el uso de ascensores; debe descender por las escaleras.',
    active: true,
    order: 1,
  },
  {
    section: 'protocolo',
    title: 'Zonas de Seguridad',
    content: 'El hotel cuenta con 4 zonas de seguridad estratégicas:\n\nZona A: Ubicada en el Comedor Arboleda, al costado del lobby.\nZona B: Situada en el lobby del Centro de Convenciones.\nZona C: Localizada frente a la entrada del lobby principal del hotel.\nZona D: Ubicada en el exterior de la entrada del Centro de Convenciones.',
    active: true,
    order: 2,
  },
  {
    section: 'protocolo',
    title: 'Recomendaciones Específicas',
    content: 'Presencia de ceniza volcánica: Se recomienda proteger nariz y boca con una prenda de vestir (preferiblemente húmeda) y cuidar la protección de los ojos.\n\nSi se encuentra en el exterior: Regrese pronto al hotel sin correr y espere las instrucciones oficiales para una posible evacuación.',
    active: true,
    order: 3,
  },
  {
    section: 'protocolo',
    title: 'Estándar de Convivencia',
    content: 'Información próximamente disponible.',
    active: true,
    order: 4,
  },
];

async function main() {
  console.log('Eliminando secciones existentes...');
  await db.delete(roomInfo).where(inArray(roomInfo.section, SECTIONS_TO_REPLACE));

  console.log('Insertando nuevos datos...');
  const result = await db.insert(roomInfo).values(items).returning();
  console.log(`✅ Insertados ${result.length} registros.`);

  const summary = result.reduce((acc, r) => {
    acc[r.section] = (acc[r.section] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  ${k}: ${v}`);
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
