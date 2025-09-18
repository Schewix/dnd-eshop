const crypto = require('crypto');

class PaymentGateway {
  constructor() {
    this.provider = 'MockGateway';
  }

  async createPaymentIntent({ amount, currency = 'CZK', orderId, paymentMethod }) {
    await new Promise((resolve) => setTimeout(resolve, 120));

    const intentId = `PAY-${crypto.randomUUID()}`;
    const status = paymentMethod === 'cod' ? 'pending_cash_on_delivery' : 'authorized';

    return {
      id: intentId,
      provider: this.provider,
      status,
      currency,
      amount,
      orderId,
      createdAt: new Date().toISOString(),
    };
  }

  async capturePayment(intent) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      ...intent,
      status: intent.status === 'authorized' ? 'captured' : intent.status,
      capturedAt: new Date().toISOString(),
    };
  }
}

module.exports = PaymentGateway;
