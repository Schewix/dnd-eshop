import { NextResponse } from 'next/server';

type CartItem = {
  id: string;
  quantity: number;
};

type Customer = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
};

type OrderPayload = {
  customer?: Customer;
  note?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  items?: CartItem[];
};

const requiredCustomerFields: Array<keyof Customer> = ['name', 'email', 'phone', 'address', 'city', 'zip', 'country'];

export async function POST(request: Request) {
  let payload: OrderPayload;

  try {
    payload = (await request.json()) as OrderPayload;
  } catch (error) {
    return NextResponse.json({ message: 'Neplatný formát požadavku.' }, { status: 400 });
  }

  const { items, shippingMethod, paymentMethod, customer } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: 'Košík je prázdný. Přidejte produkty a zkuste to znovu.' }, { status: 400 });
  }

  if (!shippingMethod || !paymentMethod) {
    return NextResponse.json({ message: 'Vyberte prosím způsob dopravy i platby.' }, { status: 400 });
  }

  if (!customer) {
    return NextResponse.json({ message: 'Doplňte prosím kontaktní údaje zákazníka.' }, { status: 400 });
  }

  const missingField = requiredCustomerFields.find((field) => !customer[field]?.toString().trim());

  if (missingField) {
    return NextResponse.json({ message: `Chybí vyplnit pole: ${missingField}.` }, { status: 400 });
  }

  const orderId = `DK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

  return NextResponse.json(
    {
      orderId,
      invoice: {
        invoiceId,
        issuedAt: new Date().toISOString(),
      },
      receivedAt: new Date().toISOString(),
    },
    { status: 201 },
  );
}
