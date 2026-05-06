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
import { spaServices } from '../lib/db/schema';

const services = [
  // Masajes y terapias
  { category: 'Masajes y terapias', name: 'Masaje Barro', description: 'Masaje corporal con barro volcánico', duration: '50 min', price: '$65.000', active: true, order: 1 },
  { category: 'Masajes y terapias', name: 'Masaje Serenidad', description: 'Masaje relajante de cuerpo completo', duration: '50 min', price: '$60.000', active: true, order: 2 },
  { category: 'Masajes y terapias', name: 'Masaje Recarga Vital', description: 'Masaje energizante para recuperar vitalidad', duration: '50 min', price: '$62.000', active: true, order: 3 },
  { category: 'Masajes y terapias', name: 'Masaje Regenerativo', description: 'Masaje profundo de tejidos para recuperación muscular', duration: '50 min', price: '$65.000', active: true, order: 4 },
  { category: 'Masajes y terapias', name: 'Masaje Piedras Calientes', description: 'Masaje terapéutico con piedras volcánicas calientes', duration: '60 min', price: '$72.000', active: true, order: 5 },
  { category: 'Masajes y terapias', name: 'Masaje Champi Hindú', description: 'Masaje tradicional hindú de cabeza y cuello', duration: '30 min', price: '$40.000', active: true, order: 6 },
  { category: 'Masajes y terapias', name: 'Masaje Alunco', description: 'Masaje signature exclusivo del Spa Alunco', duration: '80 min', price: '$90.000', active: true, order: 7 },
  { category: 'Masajes y terapias', name: 'Masaje Sueco', description: 'Masaje clásico sueco de relajación muscular', duration: '50 min', price: '$58.000', active: true, order: 8 },
  { category: 'Masajes y terapias', name: 'Masaje Relajante', description: 'Masaje suave de relajación general', duration: '50 min', price: '$55.000', active: true, order: 9 },
  { category: 'Masajes y terapias', name: 'Alunco Kids', description: 'Masaje especial para los más pequeños', duration: '30 min', price: '$35.000', active: true, order: 10 },
  { category: 'Masajes y terapias', name: 'Reflexología podal', description: 'Técnica de reflexología aplicada en pies', duration: '40 min', price: '$45.000', active: true, order: 11 },
  { category: 'Masajes y terapias', name: 'Relajante + Reflexología', description: 'Combinación de masaje relajante y reflexología podal', duration: '80 min', price: '$90.000', active: true, order: 12 },

  // Rituales de Renovación Corporal
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Volcánico', description: 'Ritual de renovación con elementos volcánicos de la región', duration: '90 min', price: '$110.000', active: true, order: 1 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Árbol de la Vida', description: 'Ritual holístico inspirado en la naturaleza del bosque nativo', duration: '90 min', price: '$115.000', active: true, order: 2 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Kundalini de Bosque', description: 'Ritual de equilibrio energético en conexión con el bosque', duration: '90 min', price: '$115.000', active: true, order: 3 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Sabiduría de la Naturaleza', description: 'Ritual ancestral con ingredientes naturales de la Araucanía', duration: '90 min', price: '$120.000', active: true, order: 4 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Agua Curativa Détox', description: 'Ritual detoxificante con aguas termales y arcillas', duration: '90 min', price: '$118.000', active: true, order: 5 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual del Montañista', description: 'Ritual revitalizante para alivio muscular profundo', duration: '90 min', price: '$112.000', active: true, order: 6 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual Signature Termal Alunco', description: 'Ritual exclusivo del Spa Alunco con ingredientes termales únicos', duration: '120 min', price: '$145.000', active: true, order: 7 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual del Chocolate', description: 'Ritual sensorial con envolvimiento de chocolate oscuro', duration: '90 min', price: '$118.000', active: true, order: 8 },
  { category: 'Rituales de Renovación Corporal', name: 'Ritual de Renovación Energética', description: 'Ritual de recarga y equilibrio de energía corporal', duration: '90 min', price: '$115.000', active: true, order: 9 },

  // Tratamientos Faciales y Jacuzzi
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Baño relajante en jacuzzi', description: 'Sesión privada de relajación en jacuzzi termal', duration: '30 min', price: '$35.000', active: true, order: 1 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Hidratación profunda', description: 'Tratamiento facial de hidratación intensiva', duration: '50 min', price: '$55.000', active: true, order: 2 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Facial descongestionante post sol', description: 'Tratamiento facial reparador y calmante para piel expuesta al sol', duration: '50 min', price: '$58.000', active: true, order: 3 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Facial completo Alunco', description: 'Tratamiento facial completo con productos exclusivos Alunco', duration: '60 min', price: '$68.000', active: true, order: 4 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Facial completo para Hombre', description: 'Tratamiento facial especializado para piel masculina', duration: '60 min', price: '$65.000', active: true, order: 5 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Facial de rejuvenecimiento', description: 'Tratamiento antiedad con técnicas de rejuvenecimiento facial', duration: '70 min', price: '$80.000', active: true, order: 6 },
  { category: 'Tratamientos Faciales y Jacuzzi', name: 'Facial Deluxe', description: 'Tratamiento facial premium con técnicas avanzadas y productos de lujo', duration: '80 min', price: '$95.000', active: true, order: 7 },

  // Peluquería y Manicure
  { category: 'Peluquería y Manicure', name: 'Lavado de pelo', description: 'Lavado y acondicionamiento profesional de cabello', duration: '20 min', price: '$15.000', active: true, order: 1 },
  { category: 'Peluquería y Manicure', name: 'Planchado de pelo largo', description: 'Planchado y liso para cabello largo', duration: '40 min', price: '$28.000', active: true, order: 2 },
  { category: 'Peluquería y Manicure', name: 'Planchado corto', description: 'Planchado y liso para cabello corto', duration: '25 min', price: '$20.000', active: true, order: 3 },
  { category: 'Peluquería y Manicure', name: 'Brushing largo', description: 'Brushing profesional para cabello largo', duration: '40 min', price: '$25.000', active: true, order: 4 },
  { category: 'Peluquería y Manicure', name: 'Brushing corto', description: 'Brushing profesional para cabello corto', duration: '25 min', price: '$18.000', active: true, order: 5 },
  { category: 'Peluquería y Manicure', name: 'Masaje capilar largo', description: 'Masaje capilar nutritivo para cabello largo', duration: '30 min', price: '$22.000', active: true, order: 6 },
  { category: 'Peluquería y Manicure', name: 'Masaje capilar corto', description: 'Masaje capilar nutritivo para cabello corto', duration: '20 min', price: '$18.000', active: true, order: 7 },
  { category: 'Peluquería y Manicure', name: 'Manicure Permanente', description: 'Manicure con esmalte permanente de larga duración', duration: '50 min', price: '$30.000', active: true, order: 8 },
  { category: 'Peluquería y Manicure', name: 'Manicure Permanente con diseño', description: 'Manicure permanente con arte y diseño personalizado', duration: '60 min', price: '$38.000', active: true, order: 9 },
  { category: 'Peluquería y Manicure', name: 'Retiro de esmalte permanente', description: 'Retiro seguro y cuidadoso de esmalte permanente', duration: '20 min', price: '$12.000', active: true, order: 10 },

  // Circuitos de Agua
  { category: 'Circuitos de Agua', name: 'Circuito Alunco', description: 'Circuito completo de aguas termales del Spa Alunco', duration: '2 hrs', price: '$45.000', active: true, order: 1 },
  { category: 'Circuitos de Agua', name: 'Circuito Enamorados', description: 'Circuito romántico para dos personas en aguas termales', duration: '2 hrs', price: '$85.000', active: true, order: 2 },
  { category: 'Circuitos de Agua', name: 'Circuito Amistad', description: 'Circuito grupal para compartir con amigos', duration: '2 hrs', price: '$75.000', active: true, order: 3 },
  { category: 'Circuitos de Agua', name: 'Circuito Súper Mamá', description: 'Circuito especial de relajación dedicado a mamás', duration: '2 hrs', price: '$80.000', active: true, order: 4 },
  { category: 'Circuitos de Agua', name: 'Circuito Para Ellos', description: 'Circuito termal diseñado especialmente para hombres', duration: '2 hrs', price: '$75.000', active: true, order: 5 },
  { category: 'Circuitos de Agua', name: 'Circuito Trabajólico', description: 'Circuito desestresante para quienes trabajan demasiado', duration: '2 hrs', price: '$75.000', active: true, order: 6 },
  { category: 'Circuitos de Agua', name: 'Circuito Relax', description: 'Circuito de relajación profunda en aguas termales', duration: '2 hrs', price: '$70.000', active: true, order: 7 },
  { category: 'Circuitos de Agua', name: 'Circuito Tonificante', description: 'Circuito estimulante para tonificar cuerpo y mente', duration: '2 hrs', price: '$72.000', active: true, order: 8 },
];

async function main() {
  console.log('Eliminando servicios SPA existentes...');
  await db.delete(spaServices);
  console.log('Servicios eliminados.');

  console.log('Insertando nuevos servicios SPA...');
  const result = await db.insert(spaServices).values(services).returning();
  console.log(`✅ Insertados ${result.length} servicios SPA.`);

  const byCategory = result.reduce((acc, s) => {
    acc[s.category!] = (acc[s.category!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  - ${cat}: ${count}`);
  }
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
