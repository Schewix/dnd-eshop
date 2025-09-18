const path = require('path');
const { writeJsonFile, ensureDirSync } = require('../utils/fileUtils');

class SupplierService {
  constructor(baseDir = path.join(process.cwd(), 'data', 'supplier-queue')) {
    this.baseDir = baseDir;
    ensureDirSync(this.baseDir);
  }

  async queueOrder(order) {
    const filePath = path.join(this.baseDir, `${order.orderId}.json`);
    const payload = {
      orderId: order.orderId,
      createdAt: new Date().toISOString(),
      supplierRouting: order.items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        preferredSupplier: item.supplier || 'auto',
      })),
      shipping: order.shipping,
      customer: order.customer,
      note: order.note,
    };

    await writeJsonFile(filePath, payload);

    return { filePath };
  }
}

module.exports = SupplierService;
