# Drak & Kostky — český D&D e-shop s dropshipping fulfilmentem

Prototyp českého internetového obchodu, který kromě katalogu produktů obsahuje i kompletní mock back-end pro objednávkový proces: vytvoření platby, vystavení faktury, vytvoření e-mailu zákazníkovi a zadání objednávky distributorovi.

## Co projekt umí

- **Front-end**: Přehled produktů s filtry (kategorie, značka, cena, skladovost), interaktivní košík, checkout formulář a vysvětlení dropshipping modelu.
- **Platební logika**: `PaymentGateway` simuluje autorizaci/capture platby (karta, převod, dobírka) a generuje ID transakce.
- **Faktury**: `InvoiceService` ukládá textové faktury do `data/invoices/INV-XXXX.txt` včetně soupisu položek a dopravy.
- **E-maily**: `EmailService` zapisuje potvrzovací e-maily do `data/outbox/*.eml`, aby bylo vidět, co by zákazníkovi odešlo.
- **Dropshipping workflow**: `SupplierService` generuje objednávku pro distributory v `data/supplier-queue/*.json`.
- **Persistované objednávky**: kompletní JSON podoba objednávky v `data/orders/ORD-XXXX.json`.

## Rychlý start

1. Ujistěte se, že máte Node.js (projekt testován na v24).
2. V kořenovém adresáři spusťte
   ```bash
   npm start
   ```
3. Otevřete <http://localhost:3000> – server servíruje statický front-end i REST API.
4. Vyberte produkty, přidejte je do košíku a dokončete objednávku. Po úspěchu najdete soubory v `data/{orders,invoices,outbox,supplier-queue}`.

## API přehled

| Metoda | Endpoint         | Popis                                 |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/api/products`  | Vrací seznam produktů z `data/products.json`.
| GET    | `/api/options`   | Dostupné dopravy a platební metody.
| POST   | `/api/orders`    | Přijme objednávku, spustí workflow (platba → faktura → e-mail → supplier). |

`POST /api/orders` přijímá payload:
```json
{
  "customer": {
    "name": "...",
    "email": "...",
    "phone": "...",
    "address": "...",
    "city": "...",
    "zip": "...",
    "country": "..."
  },
  "shippingMethod": "courier",
  "paymentMethod": "card",
  "items": [{ "id": "dice-emerald", "quantity": 2 }],
  "note": "Volitelná zpráva"
}
```

## Struktura

```
.
├── app.js                  # Front-end logika (fetch produktů, košík, checkout, volání API)
├── backend/
│   ├── orderProcessor.js   # Koordinace workflow (platba → faktura → e-mail → supplier)
│   ├── services/           # Mock služby (payment, invoice, email, supplier)
│   └── utils/              # Pomocné funkce pro práci se soubory
├── data/
│   ├── products.json       # Katalog produktů
│   ├── options.json        # Dostupné dopravy a platby
│   ├── invoices/           # Generované faktury
│   ├── outbox/             # "Odeslané" e-maily
│   ├── orders/             # JSON záznamy objednávek
│   └── supplier-queue/     # Pokyny pro fulfillment partnery
├── index.html              # UI a obsah e-shopu
├── styles.css              # Stylování a responzivní layout
├── server.js               # Jednoduchý HTTP server (statika + API)
└── package.json            # Start skript
```

## Další možné rozšíření

1. Napojení na reálné platební brány (ComGate, Stripe) a e-mailový SMTP provider.
2. Export faktur do PDF (např. přes `pdfkit`) a napojení na účetnictví (Pohoda, iDoklad).
3. Synchronizace skladovosti s ERP / Shopify pomocí webhooks.
4. Admin rozhraní pro správu objednávek, refundace a sledování zásilek.
5. Vícejazyčný front-end a SEO optimalizace produktových detailů.
