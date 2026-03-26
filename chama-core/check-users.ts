import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });
  
  const output: string[] = [];
  output.push('USER ID CONSISTENCY CHECK');
  output.push('='.repeat(60));
  output.push(`Total users: ${users.length}`);
  output.push('');
  
  users.forEach(user => {
    output.push(`ID: ${user.id}`);
    output.push(`   Email: ${user.email}`);
    output.push(`   Name: ${user.name}`);
    output.push('');
  });
  
  fs.writeFileSync('/tmp/user-check.txt', output.join('\n'));
  console.log('✅ Check complete. Results written to /tmp/user-check.txt');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
