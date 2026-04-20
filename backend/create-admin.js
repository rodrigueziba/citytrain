const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Buscamos si ya existe para no duplicarlo
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' }
  });

  if (existingAdmin) {
    console.log('El administrador ya existe.');
    return;
  }

  // Si no existe, lo creamos
  await prisma.adminUser.create({
    data: { 
      username: 'admin', 
      password: 'ushuaia2026' // Tu contraseña segura
    },
  });
  console.log('¡Administrador maestro creado con éxito! 🦇');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });