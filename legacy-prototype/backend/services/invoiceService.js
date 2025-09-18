const path = require('path');
const crypto = require('crypto');
const { writeTextFile, ensureDirSync } = require('../utils/fileUtils');

class InvoiceService {
  constructor(baseDir = path.join(process.cwd(), 'data', 'invoices')) {
    this.baseDir = baseDir;
    ensureDirSync(this.baseDir);
  }

  async generate(invoiceData) {
    const invoiceId = `INV-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
    const filePath = path.join(this.baseDir, `${invoiceId}.txt`);
    const lines = [];

    lines.push('Drak & Kostky s.r.o.');
    lines.push('Dračí hrad 13, 110 00 Praha');
    lines.push('IČO: 12345678, DIČ: CZ12345678');
    lines.push('');
    lines.push(`Faktura: ${invoiceId}`);
    lines.push(`Datum vystavení: ${new Date().toLocaleDateString('cs-CZ')}`);
    lines.push(`Způsob platby: ${invoiceData.paymentMethodLabel}`);
    lines.push('');
    lines.push(`Odběratel: ${invoiceData.customer.name}`);
    lines.push(invoiceData.customer.email);
    lines.push(`${invoiceData.customer.address}, ${invoiceData.customer.zip} ${invoiceData.customer.city}`);
    lines.push(invoiceData.customer.country);
    lines.push('');
    lines.push('Položky:');

    invoiceData.items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name} (${item.quantity} ks) – ${item.price.toLocaleString('cs-CZ')} Kč`);
    });

    lines.push('');
    lines.push(`Doprava: ${invoiceData.shipping.label} – ${invoiceData.shipping.price.toLocaleString('cs-CZ')} Kč`);
    lines.push(`Celkem k úhradě: ${invoiceData.total.toLocaleString('cs-CZ')} Kč vč. DPH`);
    if (invoiceData.note) {
      lines.push('Poznámka zákazníka:');
      lines.push(invoiceData.note);
    }

    await writeTextFile(filePath, lines.join('\n'));

    return { invoiceId, filePath };
  }
}

module.exports = InvoiceService;
