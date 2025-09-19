import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import type Order from '@medusajs/medusa/dist/models/order';
import { EntityManager, In } from 'typeorm';
import {
  supplierOrderRepository,
  supplierProductRepository,
  supplierRepository,
  supplierSnapshotRepository,
  supplierVariantRepository,
} from '../repositories/supplier-repository.js';

type Logger = {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

export type SupplierSyncItem = {
  externalId: string;
  sku: string;
  name?: string | null;
  ean?: string | null;
  stock?: number | null;
  price?: number | null;
  currency?: string | null;
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

type InjectedDependencies = {
  manager: EntityManager;
  eventBusService: EventBusService;
  logger: Logger;
};

export default class SupplierSyncService {
  protected manager_: EntityManager;
  protected eventBus_: EventBusService;
  protected logger_: Logger;

  constructor({ manager, eventBusService, logger }: InjectedDependencies) {
    this.manager_ = manager;
    this.eventBus_ = eventBusService;
    this.logger_ = logger;
  }

  withTransaction(manager: EntityManager): SupplierSyncService {
    if (!manager) {
      return this;
    }

    return new SupplierSyncService({
      manager,
      eventBusService: this.eventBus_,
      logger: this.logger_,
    });
  }

  async syncCatalog(payload: SupplierSyncPayload): Promise<void> {
    await this.manager_.transaction(async (transactionManager) => {
      const supplierRepo = supplierRepository(transactionManager);
      const productRepo = supplierProductRepository(transactionManager);
      const variantRepo = supplierVariantRepository(transactionManager);
      const snapshotRepo = supplierSnapshotRepository(transactionManager);
      const medusaVariantRepo = transactionManager.getRepository('product_variant');

      this.logger_.info(
        {
          supplier: payload.supplier.code,
          items: payload.items.length,
        },
        'Supplier catalog sync received',
      );

      let supplierEntity = await supplierRepo.findOne({ where: { code: payload.supplier.code } });
      if (!supplierEntity) {
        supplierEntity = supplierRepo.create({
          code: payload.supplier.code,
          name: payload.supplier.name,
          endpoint: payload.supplier.endpoint,
          type: payload.supplier.type ?? 'json',
          defaultCurrency: payload.supplier.currency ?? null,
        });
        supplierEntity = await supplierRepo.save(supplierEntity);
      }

      const skuList = payload.items.map((item) => item.sku);
      const medusaVariants = skuList.length
        ? await medusaVariantRepo.find({ where: { sku: In(skuList) } })
        : [];
      const medusaVariantBySku = new Map(
        medusaVariants.map((variant: any) => [variant.sku, variant]),
      );

      const missingVariants: SupplierSyncItem[] = [];

      for (const item of payload.items) {
        const medusaVariant = medusaVariantBySku.get(item.sku);
        if (!medusaVariant) {
          missingVariants.push(item);
        }

        let supplierProduct = await productRepo.findOne({
          where: { supplierId: supplierEntity.id, supplierSku: item.sku },
          relations: ['supplier'],
        });

        if (!supplierProduct) {
          supplierProduct = productRepo.create({
            supplierId: supplierEntity.id,
            supplierSku: item.sku,
          });
        }

        supplierProduct.name = item.name ?? supplierProduct.name;
        supplierProduct.ean = item.ean ?? supplierProduct.ean;
        supplierProduct.rawPayload = item.attributes ?? {};
        supplierProduct.medusaProductId = medusaVariant?.product_id ?? supplierProduct.medusaProductId;
        supplierProduct.lastSyncedAt = new Date(payload.syncedAt);

        supplierProduct = await productRepo.save(supplierProduct);

        let supplierVariant = await variantRepo.findOne({
          where: {
            supplierProductId: supplierProduct.id,
            supplierVariantId: item.externalId,
          },
        });

        if (!supplierVariant) {
          supplierVariant = variantRepo.create({
            supplierProductId: supplierProduct.id,
            supplierVariantId: item.externalId,
          });
        }

        supplierVariant.medusaVariantId = medusaVariant?.id ?? supplierVariant.medusaVariantId;
        supplierVariant.currencyCode = item.currency ?? payload.supplier.currency ?? null;
        supplierVariant.price = item.price != null ? item.price.toString() : supplierVariant.price;
        supplierVariant.stockQuantity = item.stock ?? supplierVariant.stockQuantity ?? 0;
        supplierVariant.attributes = item.attributes ?? supplierVariant.attributes;

        await variantRepo.save(supplierVariant);
      }

      await snapshotRepo.save(
        snapshotRepo.create({
          supplierId: supplierEntity.id,
          capturedAt: new Date(payload.syncedAt),
          metrics: {
            itemCount: payload.items.length,
            skuMatched: skuList.length - missingVariants.length,
            skuMissing: missingVariants.length,
          },
        }),
      );

      if (missingVariants.length) {
        await this.raiseAlert({
          supplierCode: supplierEntity.code,
          level: 'warn',
          message: 'Supplier variants missing Medusa mapping',
          meta: { sku: missingVariants.map((item) => item.sku) },
        });
      }
    });
  }

  async queueSupplierOrder(job: SupplierOrderJob): Promise<void> {
    const orderRepo = supplierOrderRepository(this.manager_);
    const supplier = await supplierRepository(this.manager_).findOne({ where: { code: job.supplierCode } });

    if (!supplier) {
      this.logger_.warn({ job }, 'Supplier not configured, skipping queue');
      await this.raiseAlert({
        supplierCode: job.supplierCode,
        level: 'warn',
        message: 'Attempted to queue supplier order for unknown supplier',
        meta: { job },
      });
      return;
    }

    await orderRepo.save(
      orderRepo.create({
        orderId: job.orderId,
        supplierId: supplier.id,
        status: 'queued',
        payload: job,
      }),
    );

    await this.eventBus_.emit('supplier-order.queued', job);
  }

  async raiseAlert(alert: SupplierAlertPayload): Promise<void> {
    this.logger_.warn(alert, 'Supplier alert');
    await this.eventBus_.emit('supplier-sync.alerted', alert);
  }

  async handleOrderPaid(orderId: string): Promise<void> {
    const orderRepo = this.manager_.getRepository('order');
    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      this.logger_.warn({ orderId }, 'Order not found when attempting supplier dispatch');
      return;
    }

    const variantIds = order.items
      .map((item) => item.variant_id)
      .filter((id): id is string => Boolean(id));

    if (!variantIds.length) {
      this.logger_.info({ orderId }, 'Order has no variants to dispatch');
      return;
    }

    const variantRepo = supplierVariantRepository(this.manager_);
    const supplierVariants = await variantRepo.find({
      where: { medusaVariantId: In(variantIds) },
      relations: ['product', 'product.supplier'],
    });

    if (!supplierVariants.length) {
      await this.raiseAlert({
        supplierCode: 'unknown',
        level: 'warn',
        message: 'No supplier mapping for order variants',
        meta: { orderId },
      });
      return;
    }

    const variantsBySupplier = new Map<string, SupplierOrderJob['lines']>();

    for (const item of order.items) {
      if (!item.variant_id) continue;
      const supplierVariant = supplierVariants.find((variant) => variant.medusaVariantId === item.variant_id);
      if (!supplierVariant || !supplierVariant.product?.supplier?.code) continue;

      const supplierCode = supplierVariant.product.supplier.code;
      const lines = variantsBySupplier.get(supplierCode) ?? [];
      lines.push({ variantId: item.variant_id, quantity: item.quantity });
      variantsBySupplier.set(supplierCode, lines);
    }

    if (!variantsBySupplier.size) {
      await this.raiseAlert({
        supplierCode: 'unknown',
        level: 'warn',
        message: 'Order variants not mapped to suppliers',
        meta: { orderId },
      });
      return;
    }

    for (const [supplierCode, lines] of variantsBySupplier.entries()) {
      await this.queueSupplierOrder({
        orderId: order.id,
        supplierCode,
        lines,
      });
    }
  }
}
