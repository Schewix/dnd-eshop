import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.IMPORTER_ENV_PATH || '.env' });

type SupplierConfig = z.infer<typeof supplierSchema>;

type ImporterConfig = z.infer<typeof importerConfigSchema>;

const supplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['csv', 'xml', 'json', 'rest']),
  endpoint: z.string(),
  authToken: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  schedule: z.string().default('0 */6 * * *'),
  priceListCurrency: z.string().default('CZK'),
});

const importerConfigSchema = z.object({
  medusa: z.object({
    baseUrl: z.string().default('http://localhost:9000'),
    apiKey: z.string().optional(),
  }),
  logLevel: z.enum(['info', 'debug', 'error']).default('info'),
  suppliers: z.array(supplierSchema),
});

export const loadConfig = (): ImporterConfig => {
  const raw = process.env.IMPORTER_CONFIG;
  if (!raw) {
    throw new Error('Missing IMPORTER_CONFIG env variable');
  }

  const parsed = importerConfigSchema.parse(JSON.parse(raw));
  return parsed;
};

export type { ImporterConfig, SupplierConfig };
