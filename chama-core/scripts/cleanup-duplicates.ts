import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicateMemberships() {
  console.log('Finding duplicate memberships...');

  // Find all duplicates
  const duplicates = await prisma.$queryRaw<
    Array<{ user_id: string; chama_id: string; count: bigint }>
  >`
    SELECT user_id, chama_id, COUNT(*) as count 
    FROM membership 
    GROUP BY user_id, chama_id 
    HAVING COUNT(*) > 1
  `;

  console.log(`Found ${duplicates.length} duplicate combinations`);

  for (const dup of duplicates) {
    console.log(
      `\nProcessing: user_id=${dup.user_id}, chama_id=${dup.chama_id}, count=${dup.count}`,
    );

    // Get all memberships for this user/chama combination, ordered by createdAt
    const memberships = await prisma.membership.findMany({
      where: {
        user_id: dup.user_id,
        chama_id: dup.chama_id,
      },
      orderBy: {
        createdAt: 'asc', // Keep the oldest one
      },
    });

    // Keep the first one (oldest), delete the rest
    const toDelete = memberships.slice(1);

    for (const membership of toDelete) {
      console.log(`  Deleting duplicate membership: ${membership.id}`);
      await prisma.membership.delete({
        where: { id: membership.id },
      });
    }
  }

  console.log('\nCleanup complete!');
}

cleanupDuplicateMemberships()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
