const { execSync } = require('child_process');

try {
  const result = execSync(
    'psql -U theboys -h localhost -d chama_db -t -c "SELECT COUNT(*) FROM \\"user\\";"',
    { encoding: 'utf8', stdio: 'pipe' }
  );
  const userCount = parseInt(result.trim());
  
  if (userCount > 0) {
    console.log('❌ DATABASE NOT RESET - Users still exist:', userCount);
  } else {
    console.log('✅ DATABASE RESET - No users found');
  }
} catch (error) {
  console.error('Error checking database:', error.message);
}
