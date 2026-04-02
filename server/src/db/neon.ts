import fs from 'node:fs/promises';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts.js';
import type { Order, Product, User } from '../types.js';

dotenv.config();

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const LOCAL_DB_FILE = path.resolve(process.cwd(), 'data', 'local-db.json');

interface LocalDb {
  products: Product[];
  orders: Order[];
  users: User[];
}

function normalizeProduct(product: Partial<Product> & { image?: string }): Product {
  return {
    id: product.id || Math.random().toString(36).slice(2, 9),
    name: product.name || 'New product',
    description: product.description || '',
    price: Number(product.price || 0),
    images: Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : product.image
        ? [product.image]
        : [],
    category: (product.category || 'bags') as Product['category'],
    popular: Boolean(product.popular),
  };
}

function normalizeOrder(order: any): Order {
  const items = Array.isArray(order.items)
    ? order.items
    : typeof order.items === 'string'
      ? JSON.parse(order.items)
      : [];

  return {
    id: order.id,
    items,
    total: Number(order.total || 0),
    status: (order.status || 'new') as Order['status'],
    address: order.address || '',
    phone: order.phone || '',
    customerName: order.customerName ?? order.customer_name,
    paymentMethod: (order.paymentMethod ?? order.payment_method ?? 'cash') as Order['paymentMethod'],
    comment: order.comment || '',
    telegramId: order.telegramId ?? order.telegram_id ?? undefined,
    createdAt: order.createdAt ?? order.created_at ?? new Date().toISOString(),
  };
}

async function ensureLocalDb() {
  await fs.mkdir(path.dirname(LOCAL_DB_FILE), { recursive: true });

  try {
    await fs.access(LOCAL_DB_FILE);
  } catch {
    const initialData: LocalDb = {
      products: DEFAULT_PRODUCTS,
      orders: [],
      users: [],
    };
    await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

async function readLocalDb(): Promise<LocalDb> {
  await ensureLocalDb();
  const raw = await fs.readFile(LOCAL_DB_FILE, 'utf8');
  const parsed = JSON.parse(raw) as Partial<LocalDb>;

  return {
    products: Array.isArray(parsed.products) && parsed.products.length > 0
      ? parsed.products.map((product) => normalizeProduct(product))
      : DEFAULT_PRODUCTS,
    orders: Array.isArray(parsed.orders)
      ? parsed.orders.map((order) => normalizeOrder(order))
      : [],
    users: Array.isArray(parsed.users) ? parsed.users : [],
  };
}

async function writeLocalDb(data: LocalDb) {
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function getSeedProductsForRemoteDb() {
  try {
    const localDb = await readLocalDb();
    return localDb.products.length > 0 ? localDb.products : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function initDatabase() {
  if (!sql) {
    await ensureLocalDb();
    console.log(`⚠️ DATABASE_URL not set, using local JSON DB at ${LOCAL_DB_FILE}`);
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      images TEXT[] DEFAULT '{}',
      category TEXT NOT NULL,
      popular BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items JSONB NOT NULL,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'new',
      address TEXT,
      phone TEXT NOT NULL,
      customer_name TEXT,
      payment_method TEXT DEFAULT 'cash',
      comment TEXT,
      telegram_id BIGINT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      telegram_id BIGINT UNIQUE,
      phone TEXT,
      name TEXT,
      addresses JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const productCountResult = await sql`SELECT COUNT(*)::int AS count FROM products`;
  const productCount = Number(productCountResult[0]?.count || 0);

  if (productCount === 0) {
    const seedProducts = await getSeedProductsForRemoteDb();

    for (const product of seedProducts) {
      await createProduct(product);
    }

    console.log(`✅ Seeded ${seedProducts.length} products into remote database`);
  }

  console.log('✅ Database tables initialized');
}

export async function getProducts() {
  if (!sql) {
    const db = await readLocalDb();
    return db.products;
  }

  const result = await sql`SELECT * FROM products ORDER BY popular DESC, created_at DESC`;
  return result.map((product) => normalizeProduct(product as Product));
}

export async function getProductById(id: string) {
  if (!sql) {
    const db = await readLocalDb();
    return db.products.find((product) => product.id === id) || null;
  }

  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  return result[0] ? normalizeProduct(result[0] as Product) : null;
}

export async function createProduct(product: Product) {
  const normalizedProduct = normalizeProduct(product);

  if (!sql) {
    const db = await readLocalDb();
    const existingIndex = db.products.findIndex((item) => item.id === normalizedProduct.id);

    if (existingIndex >= 0) {
      db.products[existingIndex] = normalizedProduct;
    } else {
      db.products.unshift(normalizedProduct);
    }

    await writeLocalDb(db);
    return normalizedProduct;
  }

  await sql`
    INSERT INTO products (id, name, description, price, images, category, popular)
    VALUES (${normalizedProduct.id}, ${normalizedProduct.name}, ${normalizedProduct.description}, ${normalizedProduct.price}, ${normalizedProduct.images}, ${normalizedProduct.category}, ${normalizedProduct.popular || false})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      images = EXCLUDED.images,
      category = EXCLUDED.category,
      popular = EXCLUDED.popular
  `;

  return normalizedProduct;
}

export async function deleteProduct(id: string) {
  if (!sql) {
    const db = await readLocalDb();
    db.products = db.products.filter((product) => product.id !== id);
    await writeLocalDb(db);
    return;
  }

  await sql`DELETE FROM products WHERE id = ${id}`;
}

export async function createOrder(order: {
  id: string;
  items: any[];
  total: number;
  address: string;
  phone: string;
  customerName?: string;
  paymentMethod: string;
  comment?: string;
  telegramId?: number;
}) {
  const normalizedOrder = normalizeOrder({
    ...order,
    status: 'new',
    createdAt: new Date().toISOString(),
  });

  if (!sql) {
    const db = await readLocalDb();
    db.orders.unshift(normalizedOrder);
    await writeLocalDb(db);
    return normalizedOrder;
  }

  await sql`
    INSERT INTO orders (id, items, total, address, phone, customer_name, payment_method, comment, telegram_id)
    VALUES (${normalizedOrder.id}, ${JSON.stringify(normalizedOrder.items)}, ${normalizedOrder.total}, ${normalizedOrder.address}, ${normalizedOrder.phone}, ${normalizedOrder.customerName}, ${normalizedOrder.paymentMethod}, ${normalizedOrder.comment || ''}, ${normalizedOrder.telegramId || null})
  `;

  return normalizedOrder;
}

export async function getOrdersByPhone(phone: string) {
  if (!sql) {
    const db = await readLocalDb();
    return db.orders
      .filter((order) => order.phone === phone)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const result = await sql`SELECT * FROM orders WHERE phone = ${phone} ORDER BY created_at DESC`;
  return result.map((order) => normalizeOrder(order));
}

export async function getAllOrders() {
  if (!sql) {
    const db = await readLocalDb();
    return db.orders
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 100);
  }

  const result = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`;
  return result.map((order) => normalizeOrder(order));
}

export async function updateOrderStatus(id: string, status: string) {
  if (!sql) {
    const db = await readLocalDb();
    db.orders = db.orders.map((order) => (
      order.id === id
        ? { ...order, status: status as Order['status'] }
        : order
    ));
    await writeLocalDb(db);
    return;
  }

  await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
}

export async function getUserByTelegramId(telegramId: number) {
  if (!sql) {
    const db = await readLocalDb();
    return db.users.find((user) => user.telegramId === telegramId) || null;
  }

  const result = await sql`SELECT * FROM users WHERE telegram_id = ${telegramId}`;
  return result[0] || null;
}

export async function createOrUpdateUser(user: {
  telegramId: number;
  phone?: string;
  name?: string;
}) {
  if (!sql) {
    const db = await readLocalDb();
    const existingIndex = db.users.findIndex((item) => item.telegramId === user.telegramId);
    const nextUser = existingIndex >= 0
      ? {
          ...db.users[existingIndex],
          phone: user.phone ?? db.users[existingIndex].phone,
          name: user.name ?? db.users[existingIndex].name,
        }
      : user;

    if (existingIndex >= 0) {
      db.users[existingIndex] = nextUser;
    } else {
      db.users.push(nextUser);
    }

    await writeLocalDb(db);
    return;
  }

  await sql`
    INSERT INTO users (telegram_id, phone, name)
    VALUES (${user.telegramId}, ${user.phone || null}, ${user.name || null})
    ON CONFLICT (telegram_id) DO UPDATE SET
      phone = COALESCE(EXCLUDED.phone, users.phone),
      name = COALESCE(EXCLUDED.name, users.name)
  `;
}

export { sql };
