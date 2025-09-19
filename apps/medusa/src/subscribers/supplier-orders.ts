import type EventBusService from '@medusajs/medusa/dist/services/event-bus';
import SupplierSyncService from '../services/supplier-sync-service.js';

export default async function supplierOrderSubscriber({
  eventBusService,
  container,
}: {
  eventBusService: EventBusService;
  container: any;
}): Promise<void> {
  const supplierSyncService: SupplierSyncService = container.resolve('supplierSyncService');

  eventBusService.subscribe('order.payment_captured', async ({ id }) => {
    await supplierSyncService.handleOrderPaid(id);
  });
}
