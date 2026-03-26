const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  console.log('Scanning database...\n');

  const globalCats = await p.expense_category.findMany({
    where: { chama_id: null },
  });

  console.log(`Found ${globalCats.length} global categories\n`);

  const nameMap = new Map();
  globalCats.forEach(cat => {
    if (!nameMap.has(cat.name)) {
      nameMap.set(cat.name, []);
    }
    nameMap.get(cat.name).push(cat.id);
  });

  console.log('Categories by name:');
  nameMap.forEach((ids, name) => {
    console.log(`  ${name}: ${ids.length} copies`);
  });

  let totalDuplicateIds = [];

  for (const [name, ids] of nameMap.entries()) {
    if (ids.length > 1) {
      const keepId = ids[0];
      const deleteIds = ids.slice(1);

      for (const delId of deleteIds) {
        const count = await p.expense.updateMany({
          where: { categoryId: delId },
          data: { categoryId: keepId },
        });
        if (count.count > 0) {
          console.log(`  ${name}: moved ${count.count} expenses`);
        }
      }

      totalDuplicateIds.push(...deleteIds);
    }
  }

  if (totalDuplicateIds.length > 0) {
    await p.expense_category.deleteMany({
      where: { id: { in: totalDuplicateIds } },
    });
    console.log(`\nDeleted ${totalDuplicateIds.length} duplicates`);
  }

  const chamaCats = await p.expense_category.count({
    where: { chama_id: { not: null } },
  });

  if (chamaCats > 0) {
    await p.expense_category.deleteMany({
      where: { chama_id: { not: null } },
    });
    console.log(`Deleted ${chamaCats} chama-specific categories`);
  }

  const final = await p.expense_category.findMany({
    where: { chama_id: null },
    orderBy: { name: 'asc' },
  });

  console.log(`\nCleanup complete! Final categories: ${final.length}`);
  final.forEach(c => console.log(`  - ${c.name}`));
}

main().finally(() => p.$disconnect());
