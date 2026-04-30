const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const chamaId = '0bbb1494-4601-4a40-81fd-65df93ab498a';
  
  // Map of wrong (global) categoryIds to their names
  const wrongCategoryMaps = [
    { wrongId: '0a5f72c8-fd93-46f9-bc3d-a6dd2633bdee', name: 'Administrative' },
    { wrongId: '234ce6f9-68e6-44b6-bb45-c9e8a48e0761', name: 'Events' },
    { wrongId: 'dc5e3c98-4ee9-40e2-ada0-4263f8831e99', name: 'Administrative' },
    { wrongId: 'd18d1094-2f16-4655-bbc6-a63abec8ef0d', name: 'Miscellaneous' },
  ];
  
  // Get correct chama-specific categories
  const chamaCats = await prisma.expense_category.findMany({
    where: { chama_id: chamaId },
  });
  
  console.log('Chama categories:');
  chamaCats.forEach(c => console.log(`  ${c.name}: ${c.id}`));
  
  console.log('\nUpdating expenses:');
  for (const map of wrongCategoryMaps) {
    const correct = chamaCats.find(c => c.name === map.name);
    if (correct) {
      const result = await prisma.expense.updateMany({
        where: { categoryId: map.wrongId },
        data: { categoryId: correct.id },
      });
      console.log(`  ✓ ${map.name}: ${result.count} expenses`);
    } else {
      console.log(`  ✗ ${map.name}: No matching category found`);
    }
  }
  
  console.log('\nVerifying:');
  const updated = await prisma.expense.findMany({
    select: { description: true, categoryId: true },
  });
  updated.forEach(e => console.log(`  ${e.description}: ${e.categoryId}`));
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
