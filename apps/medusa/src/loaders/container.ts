import { asClass } from 'awilix';
import SupplierSyncService from '../services/supplier-sync-service.js';

export default async ({ container }): Promise<void> => {
  container.register({
    supplierSyncService: asClass(SupplierSyncService).singleton(),
  });
};
