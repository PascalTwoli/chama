import { PrismaClient } from '@prisma/client';

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database contents...\n');
    
    const userCount = await prisma.user.count();
    const chamaCount = await prisma.chama.count();
    const membershipCount = await prisma.membership.count();
    
    console.log('📊 DATA COUNTS:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Chamas: ${chamaCount}`);
    console.log(`  Memberships: ${membershipCount}`);
    
    if (userCount > 0) {
      console.log('\n⚠️  USERS FOUND:');
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
        take: 5,
      });
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.id.substring(0, 20)}...)`);
      });
    }
    
    if (chamaCount > 0) {
      console.log('\n⚠️  CHAMAS FOUND:');
      const chamas = await prisma.chama.findMany({
        select: { id: true, name: true },
        take: 5,
      });
      chamas.forEach(chama => {
        console.log(`  - ${chama.name} (${chama.id})`);
      });
    }
    
    if (userCount === 0 && chamaCount === 0) {
      console.log('\n✅ Database is CLEAN - it was successfully reset!');
    } else {
      console.log('\n❌ Database still has data - reset may not have worked');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
