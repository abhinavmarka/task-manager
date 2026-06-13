import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const task = await prisma.tasks.findMany();
  console.log(task);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());