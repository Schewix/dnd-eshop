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

  const payload: SupplierSyncPayload = {
    supplier: {
      code: supplier.id,
      name: supplier.name,
      endpoint: supplier.endpoint,
      type: supplier.type,
      currency: supplier.priceListCurrency,
    },
    items: data.map((item: any, index: number) => ({
      externalId: item.id ?? item.sku ?? `${supplier.id}-${index}`,
      sku: item.sku ?? item.id ?? `${supplier.id}-${index}`,
      name: item.name,
      ean: item.ean ?? item.isbn ?? null,
      stock: item.stock ?? item.inventory ?? null,
      price: item.price ?? null,
      currency: item.currency ?? supplier.priceListCurrency,
      attributes: item.attributes ?? item, // skeleton: pass-through for later mapping
    })),
    syncedAt: new Date().toISOString(),
  };

  await pushCatalog(medusaClient, payload);
};
