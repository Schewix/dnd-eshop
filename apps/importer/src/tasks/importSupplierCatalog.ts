import type { SupplierConfig, ImporterConfig } from '../lib/config.js';
import type { Logger } from 'pino';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import {
  SupplierAlertPayload,
  SupplierSyncPayload,
  pushAlerts,
  pushCatalog,
} from '../lib/medusa.js';
import { normalizeSampleSupplierItems, sampleSupplierSchema } from '../lib/supplierSchemas.js';

interface ImportContext {
  supplier: SupplierConfig;
  config: ImporterConfig;
  logger: Logger;
  medusaClient: AxiosInstance;
}

export const importSupplierCatalog = async ({
  supplier,
  config,
  logger,
  medusaClient,
}: ImportContext) => {
  logger.info({ supplier: supplier.id, endpoint: supplier.endpoint }, 'Fetching supplier feed');

  try {
    switch (supplier.type) {
      case 'json':
      case 'rest':
        await fetchJsonFeed({ supplier, logger, medusaClient });
        break;
      case 'csv':
        logger.warn({ supplier: supplier.id }, 'CSV import not yet implemented');
        break;
      case 'xml':
        logger.warn({ supplier: supplier.id }, 'XML import not yet implemented');
        break;
      default:
        logger.warn({ supplier: supplier.id }, 'Unknown supplier type');
    }
  } catch (error) {
    const alert: SupplierAlertPayload = {
      supplierCode: supplier.id,
      level: 'error',
      message: 'Supplier feed import failed',
      meta: {
        error: error instanceof Error ? error.message : 'unknown',
      },
    };
    await pushAlerts(medusaClient, alert);
    throw error;
  }
};

const fetchJsonFeed = async ({
  supplier,
  logger,
  medusaClient,
}: {
  supplier: SupplierConfig;
  logger: Logger;
  medusaClient: AxiosInstance;
}) => {
  const headers: Record<string, string> = {};
  if (supplier.authToken) {
    headers['Authorization'] = `Bearer ${supplier.authToken}`;
  }

  const response = await axios.get(supplier.endpoint, { headers });
  const data = Array.isArray(response.data) ? response.data : [response.data];
  logger.debug({ supplier: supplier.id, records: data.length }, 'Fetched supplier payload');

  const normalizedItems = normalizeBySupplierId(data, supplier, logger);

  const payload: SupplierSyncPayload = {
    supplier: {
      code: supplier.id,
      name: supplier.name,
      endpoint: supplier.endpoint,
      type: supplier.type,
      currency: supplier.priceListCurrency,
    },
    items: normalizedItems,
    syncedAt: new Date().toISOString(),
  };

  await pushCatalog(medusaClient, payload);
};

const normalizeBySupplierId = (
  data: unknown[],
  supplier: SupplierConfig,
  logger: Logger,
): SupplierSyncPayload['items'] => {
  switch (supplier.id) {
    case 'demo':
    case 'sample': {
      const parsed = sampleSupplierSchema.safeParse(data);
      if (!parsed.success) {
        logger.warn({ supplier: supplier.id, issues: parsed.error.issues }, 'Supplier data validation failed');
        throw parsed.error;
      }
      return normalizeSampleSupplierItems(parsed.data, supplier.id, supplier.priceListCurrency);
    }
    default:
      return data.map((item, index) => ({
        externalId: typeof item === 'object' && item !== null && 'id' in item ? String((item as any).id) : `${supplier.id}-${index}`,
        sku: typeof item === 'object' && item !== null && 'sku' in item ? String((item as any).sku) : `${supplier.id}-sku-${index}`,
        name: getField(item, 'name'),
        ean: getField(item, 'ean') ?? getField(item, 'isbn'),
        stock: toNumber(getField(item, 'stock') ?? getField(item, 'inventory')),
        price: toNumber(getField(item, 'price')),
        currency: (getField(item, 'currency') as string | undefined) ?? supplier.priceListCurrency,
        attributes: typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {},
      }));
  }
};

const getField = (item: unknown, key: string): any =>
  typeof item === 'object' && item !== null && key in item ? (item as any)[key] : undefined;

const toNumber = (value: any): number | undefined => {
  if (value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
