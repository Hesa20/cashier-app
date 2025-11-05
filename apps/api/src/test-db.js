require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Get Categories
    console.log('1️⃣ Testing categories table...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) throw catError;
    console.log(`✅ Found ${categories.length} categories`);
    console.log(categories);

    // Test 2: Get Products
    console.log('\n2️⃣ Testing products table...');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*, categories(name)')
      .limit(3);
    
    if (prodError) throw prodError;
    console.log(`✅ Found ${products.length} products`);
    console.log(products);

    // Test 3: Get Orders with Items
    console.log('\n3️⃣ Testing orders with items...');
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)');
    
    if (orderError) throw orderError;
    console.log(`✅ Found ${orders.length} orders`);
    console.log(JSON.stringify(orders, null, 2));

    console.log('\n✅ All tests passed! Database connected successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testConnection();