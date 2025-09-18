import { loadConfig } from './lib/config.js';
import { getLogger } from './lib/logger.js';
import { importSupplierCatalog } from './tasks/importSupplierCatalog.js';

const main = async () => {
  const config = loadConfig();
  const logger = getLogger(config.logLevel);

  logger.info({ suppliers: config.suppliers.map((s) => s.id) }, 'Starting importer');

  for (const supplier of config.suppliers) {
    try {
      await importSupplierCatalog({ supplier, config, logger });
      logger.info({ supplier: supplier.id }, 'Import finished');
    } catch (error) {
      logger.error({ err: error, supplier: supplier.id }, 'Import failed');
    }
  }

  logger.info('All supplier jobs processed');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
