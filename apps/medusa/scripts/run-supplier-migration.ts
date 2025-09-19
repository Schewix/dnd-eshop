import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { CreateSupplierTables1700000000000 } from '../src/modules/supplier/migrations/1700000000000-create-supplier-tables.js';
import { Supplier } from '../src/modules/supplier/entities/supplier.js';
import { SupplierProduct } from '../src/modules/supplier/entities/supplier-product.js';
import { SupplierVariant } from '../src/modules/supplier/entities/supplier-variant.js';
import { SupplierOrder } from '../src/modules/supplier/entities/supplier-order.js';
import { SupplierInventorySnapshot } from '../src/modules/supplier/entities/supplier-inventory-snapshot.js';

const envPath = process.env.ENV_FILE || path.join(process.cwd(), 'apps/medusa/.env');
dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined. Set it in apps/medusa/.env or environment.');
}

const dataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Supplier, SupplierProduct, SupplierVariant, SupplierOrder, SupplierInventorySnapshot],
  migrations: [CreateSupplierTables1700000000000],
  schema: process.env.POSTGRES_SCHEMA || 'public',
  logging: ['error'],
});

(async () => {
  await dataSource.initialize();
  try {
    await dataSource.runMigrations({ transaction: 'all' });
    console.log('Supplier tables migration completed.');
  } finally {
    await dataSource.destroy();
  }
})();
