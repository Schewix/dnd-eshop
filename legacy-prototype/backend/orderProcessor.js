const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PaymentGateway = require('./services/paymentGateway');
const InvoiceService = require('./services/invoiceService');
const EmailService = require('./services/emailService');
const SupplierService = require('./services/supplierService');
const { writeJsonFile, ensureDirSync } = require('./utils/fileUtils');

const dataDir = path.join(process.cwd(), 'data');
const productsPath = path.join(dataDir, 'products.json');
const optionsPath = path.join(dataDir, 'options.json');
const ordersDir = path.join(dataDir, 'orders');

ensureDirSync(ordersDir);

const loadJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'));

const products = loadJson(productsPath);
const options = loadJson(optionsPath);

const paymentGateway = new PaymentGateway();
const invoiceService = new InvoiceService();
const emailService = new EmailService();
const supplierService = new SupplierService();

const findShipping = (id) => options.shippingMethods.find((s) => s.id === id);
const findPayment = (id) => options.paymentMethods.find((p) => p.id === id);

const calculateOrder = (items, shippingId) => {
  const enrichedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      throw new Error(`Produkt ${item.id} neexistuje`);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      supplier: product.stock ? 'primary' : 'backorder',
    };
  });

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = findShipping(shippingId);
  if (!shipping) {
    throw new Error('Neplatná doprava');
  }

  const total = subtotal + shipping.price;

  return { items: enrichedItems, subtotal, shipping };
};

const validateOrderPayload = (payload) => {
  const errors = [];
  if (!payload) {
    throw new Error('Chybí tělo požadavku');
  }
  const { customer, items, shippingMethod, paymentMethod } = payload;
  if (!customer) errors.push('customer');
  if (!items || !Array.isArray(items) || !items.length) errors.push('items');
  if (!shippingMethod) errors.push('shippingMethod');
  if (!paymentMethod) errors.push('paymentMethod');
  if (errors.length) {
    throw new Error(`Neplatná data: ${errors.join(', ')}`);
  }
  const requiredCustomerFields = ['name', 'email', 'address', 'city', 'zip', 'country'];
  const missing = requiredCustomerFields.filter((field) => !customer[field]);
  if (missing.length) {
    throw new Error(`Chybí údaje zákazníka: ${missing.join(', ')}`);
  }
};

const processOrder = async (payload) => {
  validateOrderPayload(payload);

  const { items, subtotal, shipping } = calculateOrder(
    payload.items,
    payload.shippingMethod
  );

  const paymentMeta = findPayment(payload.paymentMethod);
  if (!paymentMeta) {
    throw new Error('Neplatná platební metoda');
  }

  const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  const total = subtotal + shipping.price;

  const paymentIntent = await paymentGateway.createPaymentIntent({
    amount: total,
    orderId,
    paymentMethod: payload.paymentMethod,
  });

  const orderRecord = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: payload.customer,
    items,
    subtotal,
    shipping,
    payment: paymentIntent,
    paymentMethod: payload.paymentMethod,
    paymentMethodLabel: paymentMeta.label,
    note: payload.note || '',
    total,
  };

  await writeJsonFile(path.join(ordersDir, `${orderId}.json`), orderRecord);

  const invoice = await invoiceService.generate({
    ...orderRecord,
    shipping,
    paymentMethodLabel: paymentMeta.label,
  });

  await emailService.sendOrderConfirmation(orderRecord, invoice);
  await supplierService.queueOrder(orderRecord);

  return {
    orderId,
    total,
    payment: paymentIntent,
    invoice,
    shipping,
    paymentMethod: paymentMeta,
  };
};

module.exports = {
  processOrder,
  options,
  products,
};
