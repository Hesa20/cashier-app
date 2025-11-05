require('dotenv').config();
const supabase = require('../config/supabase');

async function inspectSchema() {
  try {
    const tables = ['categories', 'products', 'orders', 'order_items'];
    
    console.log('📊 INSPECTING SUPABASE SCHEMA\n');
    console.log('='.repeat(60));
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`\n❌ Table: ${table}`);
        console.log(`   Error: ${error.message}`);
        continue;
      }
      
      if (!data || data.length === 0) {
        console.log(`\n📋 Table: ${table}`);
        console.log(`   Status: Empty (no rows)`);
        continue;
      }
      
      console.log(`\n📋 Table: ${table}`);
      console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
      console.log(`   Sample data types:`);
      
      for (const [key, value] of Object.entries(data[0])) {
        const type = value === null ? 'null' : typeof value;
        const displayValue = type === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : value;
        console.log(`     - ${key}: ${type} (${displayValue})`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Schema inspection complete\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

inspectSchema();
