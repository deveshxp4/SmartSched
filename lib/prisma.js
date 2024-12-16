import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();

// Export the Prisma Client instance
export { prisma };

// Optionally, you can add Prisma logging and error handling
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
  });
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client disconnected');
  process.exit(0);
});
