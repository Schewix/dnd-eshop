import { z } from 'zod';
import type { SupplierSyncPayload } from './medusa.js';

export const sampleSupplierItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  name: z.string().optional(),
  ean: z.string().optional(),
  isbn: z.string().optional(),
  stock: z.number().optional(),
  inventory: z.number().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  attributes: z.record(z.any()).optional(),
});

export const sampleSupplierSchema = z.array(sampleSupplierItemSchema);

export const normalizeSampleSupplierItems = (
  items: z.infer<typeof sampleSupplierSchema>,
  supplierId: string,
  fallbackCurrency: string,
): SupplierSyncPayload['items'] =>
  items.map((item, index) => ({
    externalId: item.id ?? `${supplierId}-${index}`,
    sku: item.sku,
    name: item.name,
    ean: item.ean ?? item.isbn ?? null,
    stock: item.stock ?? item.inventory ?? null,
    price: item.price ?? null,
    currency: item.currency ?? fallbackCurrency,
    attributes: item.attributes ?? {},
  }));
