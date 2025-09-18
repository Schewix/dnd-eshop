import type { SupplierConfig, ImporterConfig } from '../lib/config.js';
import type { Logger } from 'pino';
import axios from 'axios';

interface ImportContext {
  supplier: SupplierConfig;
  config: ImporterConfig;
  logger: Logger;
}

export const importSupplierCatalog = async ({ supplier, config, logger }: ImportContext) => {
  logger.info({ supplier: supplier.id, endpoint: supplier.endpoint }, 'Fetching supplier feed');

  switch (supplier.type) {
    case 'json':
    case 'rest':
      await fetchJsonFeed(supplier, config, logger);
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
};

const fetchJsonFeed = async (
  supplier: SupplierConfig,
  _config: ImporterConfig,
  logger: Logger,
) => {
  const headers: Record<string, string> = {};
  if (supplier.authToken) {
    headers['Authorization'] = `Bearer ${supplier.authToken}`;
  }

  const response = await axios.get(supplier.endpoint, { headers });
  logger.debug({ supplier: supplier.id, records: Array.isArray(response.data) ? response.data.length : 1 }, 'Fetched supplier payload');
  // TODO: transform payload → Medusa product operations
};
