const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'data', 'products.json');
const outDir = path.join(__dirname, '..', 'data');
const outFile = path.join(outDir, 'seed-output.json');

try {
  const raw = fs.readFileSync(src, 'utf8');
  const products = JSON.parse(raw);

  // write a safe seed output file (does not touch external systems)
  const payload = {
    seededAt: new Date().toISOString(),
    count: products.length,
    products,
  };

  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Seeded ${products.length} products -> ${outFile}`);
  process.exit(0);
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exit(1);
}
