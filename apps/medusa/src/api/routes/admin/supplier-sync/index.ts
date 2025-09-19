import type { Request, Response } from 'express';
import { Router } from 'express';
import SupplierSyncService, {
  SupplierAlertPayload,
  SupplierOrderJob,
  SupplierSyncPayload,
} from '../../../../services/supplier-sync-service.js';

const route = Router();

type ScopedRequest = Request & { scope: { resolve: (key: string) => any } };

export default (adminRouter: Router) => {
  adminRouter.use('/supplier-sync', route);

  route.post('/catalog', async (req: ScopedRequest, res: Response) => {
    const supplierSyncService: SupplierSyncService = req.scope.resolve('supplierSyncService');
    const payload = req.body as SupplierSyncPayload;
    await supplierSyncService.syncCatalog(payload);
    res.status(202).json({ status: 'catalog-sync-accepted' });
  });

  route.post('/orders', async (req: ScopedRequest, res: Response) => {
    const supplierSyncService: SupplierSyncService = req.scope.resolve('supplierSyncService');
    const job = req.body as SupplierOrderJob;
    await supplierSyncService.queueSupplierOrder(job);
    res.status(202).json({ status: 'order-queued' });
  });

  route.post('/alerts', async (req: ScopedRequest, res: Response) => {
    const supplierSyncService: SupplierSyncService = req.scope.resolve('supplierSyncService');
    const alert = req.body as SupplierAlertPayload;
    await supplierSyncService.raiseAlert(alert);
    res.status(202).json({ status: 'alert-forwarded' });
  });

  return adminRouter;
};
