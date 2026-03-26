const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const expenses = await prisma.expense.findMany({
    select: {
      id: true,
      description: true,
      categoryId: true,
      category: { select: { id: true, name: true } }
    }
  });
  
  console.log('=== EXPENSES IN DATABASE ===');
  expenses.forEach(e => {
    console.log(`${e.description}: categoryId=${e.categoryId}, category.name=${e.category?.name}`);
  });
  
  const categories = await prisma.expense_category.findMany({
    select: { id: true, name: true, chama_id: true }
  });
  
  console.log('\n=== CATEGORIES IN DATABASE ===');
  categories.forEach(c => {
    console.log(`${c.name}: id=${c.id}, chama_id=${c.chama_id}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
