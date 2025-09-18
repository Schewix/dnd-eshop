const path = require('path');
const { writeTextFile, ensureDirSync } = require('../utils/fileUtils');

class EmailService {
  constructor(baseDir = path.join(process.cwd(), 'data', 'outbox')) {
    this.baseDir = baseDir;
    ensureDirSync(this.baseDir);
  }

  async sendOrderConfirmation(order, invoice) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(
      this.baseDir,
      `${timestamp}-${order.orderId}-confirmation.eml`
    );

    const subject = `Potvrzení objednávky ${order.orderId}`;
    const body = [
      `Dobrý den ${order.customer.name},`,
      '',
      'děkujeme za vaši objednávku u Drak & Kostky.',
      '',
      'Souhrn objednávky:',
      ...order.items.map(
        (item) => `- ${item.name} (${item.quantity} ks) – ${(item.price * item.quantity).toLocaleString('cs-CZ')} Kč`
      ),
      '',
      `Doprava: ${order.shipping.label} – ${order.shipping.price.toLocaleString('cs-CZ')} Kč`,
      `Celkem: ${order.total.toLocaleString('cs-CZ')} Kč`,
      '',
      'Fakturu naleznete v příloze (viz úložiště invoices).',
      '',
      'S přáním epických hodů kostkami,',
      'Drak & Kostky tým'
    ].join('\n');

    const content = [
      `To: ${order.customer.email}`,
      'From: podpora@drakakostky.cz',
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
      '',
      `Příloha: ${invoice.filePath}`,
    ].join('\n');

    await writeTextFile(filePath, content);

    return { filePath };
  }
}

module.exports = EmailService;
