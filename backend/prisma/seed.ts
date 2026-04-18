import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL debe estar definida para ejecutar el seed');
}

// Inicializamos el Pool y el Adaptador
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando la carga de datos (Seed)...');

  // 1. Cargar Categorías de Pasajes
  const categories = [
    { name: 'Jubilado', price: 15000 },
    { name: 'Estudiante', price: 15000 },
    { name: 'Turista Nacional', price: 20000 },
    { name: 'Turista Extranjero', price: 25000 },
  ];

  for (const cat of categories) {
    await prisma.ticketCategory.upsert({
      where: { name: cat.name },
      update: { price: cat.price },
      create: cat,
    });
  }
  console.log('✅ Categorías de pasajes cargadas.');

  // 2. Cargar Horarios Fijos
  const timeSlots = [
    { time: '10:30', capacity: 40 },
    { time: '12:00', capacity: 40 },
    { time: '15:30', capacity: 40 },
    { time: '17:30', capacity: 40 },
  ];

  for (const slot of timeSlots) {
    await prisma.timeSlot.upsert({
      where: { time: slot.time },
      update: { capacity: slot.capacity },
      create: slot,
    });
  }
  console.log('✅ Horarios cargados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
