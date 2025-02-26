import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const userList = fs.readFileSync('usernames.txt', 'utf-8').split('\n');

  const users = userList.map((name) => ({ name }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log('Users inserted successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });