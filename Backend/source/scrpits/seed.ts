import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  // Read the user list from a file
  const userList = fs.readFileSync('usernames.txt', 'utf-8').split('\n');

  // Prepare data for bulk insertion
  const users = userList.map((name) => ({ name }));

  // Insert users in bulk
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // Skip duplicates if any
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