import dotenv from 'dotenv';
import { DEFAULT_PRODUCTS } from './data/defaultProducts.js';
import { createProduct, initDatabase } from './db/neon.js';

dotenv.config();

async function seed() {
  console.log('🌱 Seeding database...');

  await initDatabase();

  for (const product of DEFAULT_PRODUCTS) {
    await createProduct(product);
    console.log(`  ✓ ${product.name}`);
  }

  console.log(`\n✅ ${DEFAULT_PRODUCTS.length} products seeded!`);
  process.exit(0);
}

seed().catch(console.error);
