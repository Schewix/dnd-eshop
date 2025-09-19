import { EntityManager, Repository } from 'typeorm';
import { Supplier } from '../modules/supplier/entities/supplier.js';
import { SupplierProduct } from '../modules/supplier/entities/supplier-product.js';
import { SupplierVariant } from '../modules/supplier/entities/supplier-variant.js';
import { SupplierOrder } from '../modules/supplier/entities/supplier-order.js';
import { SupplierInventorySnapshot } from '../modules/supplier/entities/supplier-inventory-snapshot.js';

export const supplierRepository = (manager: EntityManager): Repository<Supplier> =>
  manager.getRepository(Supplier);

export const supplierProductRepository = (manager: EntityManager): Repository<SupplierProduct> =>
  manager.getRepository(SupplierProduct);

export const supplierVariantRepository = (manager: EntityManager): Repository<SupplierVariant> =>
  manager.getRepository(SupplierVariant);

export const supplierOrderRepository = (manager: EntityManager): Repository<SupplierOrder> =>
  manager.getRepository(SupplierOrder);

export const supplierSnapshotRepository = (
  manager: EntityManager,
): Repository<SupplierInventorySnapshot> => manager.getRepository(SupplierInventorySnapshot);
