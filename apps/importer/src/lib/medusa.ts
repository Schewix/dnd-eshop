import axios, { AxiosInstance } from 'axios';

type SupplierSyncItem = {
  externalId: string;
  sku: string;
  name?: string;
  ean?: string;
  stock?: number;
  price?: number;
  currency?: string;
  attributes?: Record<string, unknown>;
};

export type SupplierSyncPayload = {
  supplier: {
    code: string;
    name: string;
    endpoint?: string;
    type?: 'json' | 'xml' | 'csv' | 'rest';
    currency?: string;
  };
  items: SupplierSyncItem[];
  syncedAt: string;
};

export type SupplierOrderJob = {
  orderId: string;
  supplierCode: string;
  lines: Array<{
    variantId: string;
    quantity: number;
  }>;
};

export type SupplierAlertPayload = {
  supplierCode: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: Record<string, unknown>;
};

type CreateClientOptions = {
  baseUrl: string;
  apiKey?: string;
};

export const createMedusaAdminClient = ({ baseUrl, apiKey }: CreateClientOptions): AxiosInstance => {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (apiKey) {
    headers.authorization = `Bearer ${apiKey}`;
  }

  return axios.create({
    baseURL: `${baseUrl.replace(/\/$/, '')}/admin`,
    headers,
    timeout: 10000,
  });
};

export const pushCatalog = async (client: AxiosInstance, payload: SupplierSyncPayload): Promise<void> => {
  await client.post('/supplier-sync/catalog', payload);
};

export const pushAlerts = async (client: AxiosInstance, payload: SupplierAlertPayload): Promise<void> => {
  await client.post('/supplier-sync/alerts', payload);
};

export const pushSupplierOrder = async (client: AxiosInstance, payload: SupplierOrderJob): Promise<void> => {
  await client.post('/supplier-sync/orders', payload);
};
