require('dotenv').config();
const { Pool } = require('pg');

const connStr = process.env.DATABASE_URL;
console.log('🔍 Testing direct PG connection...\n');
console.log('Connection string:', connStr ? connStr.substring(0, 60) + '...' : 'NOT SET');

if (!connStr) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const match = connStr.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (match) {
  const [, user, password, host, port, database] = match;
  console.log('\nParsed connection:');
  console.log('  User:', user);
  console.log('  Host:', host);
  console.log('  Port:', port);
  console.log('  Database:', database);
  console.log('');

  const pool = new Pool({
    user,
    password,
    host,
    port: parseInt(port),
    database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    // Disable IPv6, use IPv4 only
    options: '-c search_path=public'
  });

  pool.query('SELECT current_database(), version()')
    .then(res => {
      console.log('✅ Connection successful!');
      console.log('Database:', res.rows[0].current_database);
      console.log('Version:', res.rows[0].version.substring(0, 50) + '...');
      return pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' ORDER BY table_name');
    })
    .then(res => {
      console.log('\n📋 Tables found:', res.rows.map(r => r.table_name).join(', '));
      pool.end();
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Connection failed:', err.message);
      console.error('Code:', err.code);
      console.error('Address:', err.address);
      pool.end();
      process.exit(1);
    });
} else {
  console.error('❌ Failed to parse DATABASE_URL');
  process.exit(1);
}
