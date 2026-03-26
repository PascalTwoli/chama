const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function cleanDatabase() {
  const tables = [
    'notification',
    'notification_type',
    'payment',
    'contribution',
    'transaction',
    'join_request',
    'expense_approval_workflow',
    'expense',
    'expense_category',
    'chama_settings',
    'invite',
    'membership',
    'role_permission',
    'role',
    'chama',
    'user',
  ];

  try {
    console.log('🔄 Cleaning database tables...\n');
    
    for (const table of tables) {
      try {
        const cmd = `psql -U theboys -h localhost -d chama_db -c "TRUNCATE TABLE \\"${table}\\" CASCADE;" 2>&1`;
        await execAsync(cmd);
        console.log(`✅ Cleaned: ${table}`);
      } catch (error) {
        // Table might not exist, that's ok
        if (!error.message.includes('does not exist')) {
          console.warn(`⚠️  ${table}: ${error.message.substring(0, 80)}`);
        }
      }
    }
    
    console.log('\n✅ Database cleanup complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
