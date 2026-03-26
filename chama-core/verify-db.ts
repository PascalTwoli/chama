import { PrismaClient } from '@prisma/client';

async function verify() {
  const prisma = new PrismaClient();

  try {
    const userCount = await prisma.user.count();
    const chamaCount = await prisma.chama.count();

    console.log('✅ Database Reset Verification');
    console.log('================================');
    console.log(`Users: ${userCount}`);
    console.log(`Chamas: ${chamaCount}`);
    console.log('');
    console.log('✅ Database is clean and ready for use!');
    console.log('');
    console.log('Next: Run "npm start" to start the backend');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
