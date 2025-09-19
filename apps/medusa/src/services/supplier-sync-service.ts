import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { EntityManager } from 'typeorm';
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
    const manager = this.manager_;
    await manager.transaction(async (transactionManager) => {
      const supplierRepo = supplierRepository(transactionManager);
      const productRepo = supplierProductRepository(transactionManager);
      const variantRepo = supplierVariantRepository(transactionManager);
      const snapshotRepo = supplierSnapshotRepository(transactionManager);

      this.logger_.info(
        {
          supplier: payload.supplier.code,
          items: payload.items.length,
        },
        'Supplier catalog received – skeleton handler, TODO: implement persistence',
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
        await supplierRepo.save(supplierEntity);
      }

      await snapshotRepo.save(
        snapshotRepo.create({
          supplierId: supplierEntity.id,
          capturedAt: new Date(payload.syncedAt),
          metrics: {
            itemCount: payload.items.length,
          },
        }),
      );

      payload.items.slice(0, 5).forEach((item) => {
        this.logger_.debug(
          { sku: item.sku, externalId: item.externalId },
          'TODO: map supplier variant to Medusa product variant',
        );
      });

      void productRepo;
      void variantRepo;
    });
  }

  async queueSupplierOrder(job: SupplierOrderJob): Promise<void> {
    const orderRepo = supplierOrderRepository(this.manager_);
    this.logger_.info(job, 'Queue supplier order skeleton');
    const supplier = await supplierRepository(this.manager_).findOne({ where: { code: job.supplierCode } });
    if (!supplier) {
      this.logger_.warn({ job }, 'Supplier not configured, skipping queue');
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
    this.logger_.warn(alert, 'Supplier alert (skeleton)');
    await this.eventBus_.emit('supplier-sync.alerted', alert);
  }

  async handleOrderPaid(orderId: string): Promise<void> {
    this.logger_.info({ orderId }, 'Order paid – TODO build supplier fulfillment fanout');
  }
}
