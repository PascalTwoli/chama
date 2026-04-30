import { PrismaClient } from '@prisma/client';

async function checkUsers() {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });

    console.log('\n📊 USERS IN DATABASE:');
    console.log('='.repeat(60));
    if (users.length === 0) {
      console.log('✅ No users found - Database is CLEAN!');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach(user => {
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name || '(not set)'}`);
        console.log(`  ID: ${user.id.substring(0, 20)}...`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
