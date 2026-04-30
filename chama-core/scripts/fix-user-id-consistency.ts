/**
 * Database Consistency Fix Script
 * 
 * Identifies and logs users with inconsistent IDs (UUID vs Firebase UID format)
 * This helps ensure all users use Firebase UID as their database ID going forward.
 * 
 * Usage: npx ts-node scripts/fix-user-id-consistency.ts --check
 *        npx ts-node scripts/fix-user-id-consistency.ts --fix
 *        npx ts-node scripts/fix-user-id-consistency.ts --clean
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserIdAnalysis {
  id: string;
  email: string;
  name: string;
  idLength: number;
  idType: 'UUID' | 'Firebase UID' | 'Unknown';
  isValid: boolean;
}

// Firebase UIDs are typically 28 characters (alphanumeric mix)
// UUIDs are 36 characters with hyphens (8-4-4-4-12 format)
function analyzeIdType(id: string): UserIdAnalysis['idType'] {
  if (!id) return 'Unknown';
  
  // Check if it's a standard UUID format
  const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  if (uuidRegex.test(id)) {
    return 'UUID';
  }
  
  // Firebase UIDs are typically 28 chars, alphanumeric
  if (id.length === 28 && /^[a-zA-Z0-9]+$/.test(id)) {
    return 'Firebase UID';
  }
  
  // If neither pattern matches but looks like Firebase (no hyphens, reasonable length)
  if (id.length > 20 && id.length < 35 && !id.includes('-')) {
    return 'Firebase UID';
  }
  
  return 'Unknown';
}

async function checkConsistency() {
  console.log('🔍 Checking database for user ID consistency issues...\n');
  
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });
  
  const analysis: UserIdAnalysis[] = users.map(user => ({
    ...user,
    idLength: user.id.length,
    idType: analyzeIdType(user.id),
    isValid: analyzeIdType(user.id) === 'Firebase UID',
  }));
  
  // Group by ID type
  const byType = analysis.reduce((acc, user) => {
    if (!acc[user.idType]) acc[user.idType] = [];
    acc[user.idType].push(user);
    return acc;
  }, {} as Record<string, UserIdAnalysis[]>);
  
  console.log('📊 USER ID FORMAT SUMMARY:');
  console.log('='.repeat(60));
  
  Object.entries(byType).forEach(([type, users]) => {
    console.log(`\n${type}: ${users.length} user(s)`);
    users.forEach(user => {
      const status = user.isValid ? '✓' : '⚠️';
      console.log(`  ${status} ${user.email || '(no email)'} - ID: ${user.id.substring(0, 20)}...`);
    });
  });
  
  const problematicUsers = analysis.filter(u => u.idType === 'UUID');
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 ANALYSIS:`);
  console.log(`   Total users: ${users.length}`);
  console.log(`   With Firebase UID: ${analysis.filter(u => u.idType === 'Firebase UID').length}`);
  console.log(`   With Random UUID: ${problematicUsers.length}`);
  
  if (problematicUsers.length > 0) {
    console.log(`\n⚠️  ISSUE DETECTED: ${problematicUsers.length} user(s) with random UUID IDs`);
    console.log('   These were likely created before the Firebase UID fix.');
    console.log('   Recommendation: Delete and recreate in dev environment.');
  } else {
    console.log('\n✅ All users have consistent ID format (Firebase UID)');
  }
}

async function cleanDatabase() {
  console.log('🗑️  Cleaning database - removing users with random UUID IDs...\n');
  
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });
  
  const problematicUsers = users.filter(user => {
    const idType = analyzeIdType(user.id);
    return idType === 'UUID';
  });
  
  if (problematicUsers.length === 0) {
    console.log('✅ No problematic users found. Database is already clean!');
    return;
  }
  
  console.log(`Found ${problematicUsers.length} user(s) with random UUID IDs:\n`);
  problematicUsers.forEach(user => {
    console.log(`  • ${user.email || '(no email)'} - ID: ${user.id}`);
  });
  
  console.log('\n⚠️  OPERATION: Deleting these users and all their related data...');
  console.log('   This will cascade delete: memberships, transactions, join_requests, etc.\n');
  
  let deletedCount = 0;
  for (const user of problematicUsers) {
    try {
      // Prisma with cascade delete will handle related records
      await prisma.user.delete({
        where: { id: user.id },
      });
      deletedCount++;
      console.log(`  ✓ Deleted ${user.email || user.id}`);
    } catch (error) {
      console.error(`  ✗ Failed to delete ${user.email || user.id}:`, error);
    }
  }
  
  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} user(s) and their data.`);
  console.log('   The database is now clean for development.\n');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--check';
  
  try {
    if (command === '--check') {
      await checkConsistency();
    } else if (command === '--clean') {
      await cleanDatabase();
    } else {
      console.log('Usage:');
      console.log('  npx ts-node scripts/fix-user-id-consistency.ts --check');
      console.log('  npx ts-node scripts/fix-user-id-consistency.ts --clean');
      console.log('\nCommands:');
      console.log('  --check  : Analyze and report database state (non-destructive)');
      console.log('  --clean  : Delete users with random UUID IDs (destructive in dev)');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
