/**
 * Direct Database Reset Script
 * This script will:
 * 1. Drop and recreate the database
 * 2. Run all migrations
 * 3. Verify the database is clean
 */

const { execSync } = require('child_process');
const path = require('path');

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...\n');
    
    // Step 1: Push schema (this will recreate the database)
    console.log('Step 1: Pushing Prisma schema to database...');
    execSync('npx prisma db push --skip-generate --force-reset', {
      cwd: __dirname,
      stdio: 'inherit',
    });
    
    console.log('\n✅ Database schema pushed successfully\n');
    
    // Step 2: Verify the database is clean
    console.log('Step 2: Verifying database is empty...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const userCount = await prisma.user.count();
    const chamaCount = await prisma.chama.count();
    
    await prisma.$disconnect();
    
    if (userCount === 0 && chamaCount === 0) {
      console.log('✅ Database verification passed!');
      console.log(`   Users: 0`);
      console.log(`   Chamas: 0`);
      console.log('\n✅ DATABASE RESET COMPLETE\n');
    } else {
      console.log('❌ Database still has data:');
      console.log(`   Users: ${userCount}`);
      console.log(`   Chamas: ${chamaCount}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error during reset:', error.message);
    process.exit(1);
  }
}

resetDatabase();
