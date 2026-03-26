const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const all = await p.expense_category.findMany();
  const global_cats = all.filter(c => !c.chama_id);
  const chama_cats = all.filter(c => c.chama_id);
  
  console.log('Global:', global_cats.length, 'Chama-specific:', chama_cats.length);
  
  const events = all.filter(c => c.name === 'Events');
  console.log('All Events IDs:');
  events.forEach(c => console.log(`  ${c.id}`));
})().finally(() => process.exit());
