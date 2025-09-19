# Fáze 2 — Integrace dodavatelů

Tento dokument navazuje na Roadmapu a popisuje datový model, workflow importu a postup zavedení automatického odesílání objednávek.

## 1. Analýza feedů

| Dodavatel | Formát | Autorizace | End-point | Poznámky |
|-----------|--------|------------|-----------|----------|
| Legend Dice | JSON REST | Bearer token | `https://api.legenddice.eu/v1/products` | obsahuje varianty (materiál, barva) |
| Gale Force Nine | XML | Basic Auth | `https://partners.gf9.com/export.xml` | sklady USA/EU, potřebné mapování měn |
| Wizards Direct | CSV | SFTP | `/bulk/products.csv` | obsahuje EAN/ISBN, kategorie |
| Critical Role Shop | REST | API key | `https://api.critrole.com/merch` | pro merch/bundly |

> Doporučeno vytvořit `docs/suppliers/` a ukládat JSON/CSV ukázky feedů pro testování.

## 2. Datový model (Medusa)

Navrhujeme rozšířit Medusa o následující entity (TypeORM):

### 2.1 `supplier`
>
> ✅ Skeleton implementace entit/migrací žije v `apps/medusa/src/modules/supplier`.

- `id` (uuid)
- `name`
- `code` (unikátní string, např. `legend_dice`)
- `endpoint`
- `type` (`json` | `xml` | `csv` | `rest`)
- `auth_token` / `username` / `password`
- `currency`
- `active` (bool)

### 2.2 `supplier_product`

- `id`
- `supplier_id`
- `supplier_sku`
- `ean` / `isbn`
- `name`
- `raw_payload` (jsonb) — uložit poslední feed kvůli auditům
- `last_synced_at`
- `medusa_product_id` (nullable, pro mapování na interní katalog)

### 2.3 `supplier_variant`

- `id`
- `supplier_product_id`
- `supplier_variant_id`
- `medusa_variant_id`
- `attributes` (materiál, barva, jazyk)
- `stock`
- `price`

### 2.4 `supplier_inventory_snapshot`

- `id`
- `supplier_id`
- `captured_at`
- `metrics` (jsonb)

### 2.5 `supplier_order`

- `id`
- `order_id` (Medusa order)
- `supplier_id`
- `payload` (jsonb)
- `status` (`queued`, `sent`, `failed`, `acknowledged`)
- `tracking_number`
- `last_error`

> Implementace: vytvořit TypeORM entity v `apps/medusa/src/modules/supplier`, migrace (`medusa migration create`), service + repository.
>
> Poznámka: migrace předpokládá PostgreSQL rozšíření `uuid-ossp` (viz `CREATE EXTENSION` v souboru migrace).
> Doporučený helper: `pnpm --filter medusa build && node apps/medusa/dist/scripts/run-supplier-migration.js`.

## 3. Importní workflow

### 3.1 Cron/Worker

*Nově*: API endpointy `POST /admin/supplier-sync/(catalog|orders|alerts)` přijímají payloady z importeru (viz `SupplierSyncService`).

- Použij `apps/importer` (Node + TS + axios + zod).
- Spouštět 4× denně (0:00, 6:00, 12:00, 18:00) – napojit na BullMQ/Temporal později.
- Workflow:
  1. Načíst konfiguraci (ENV `IMPORTER_CONFIG`).
  2. Stáhnout feed.
  3. Validovat data (`zod` schémata per dodavatel).
  4. Transformovat → Medusa Admin API (`/admin/products`, `/admin/inventory-items`).
  5. Zapsat/aktualizovat `supplier_product`, `supplier_variant`.
  6. Uložit snapshot (inventář a ceny).

### 3.2 Mapování SKU/variant

- V Medusa přidat custom service `SupplierService` pro propojení `product_variant.metadata` s `supplier_variant_id`.
- Při importu:
  - Pokud existuje `supplier_product.medusa_product_id` → update.
  - Jinak vytvořit draft product a označit k manuálnímu schválení.

### 3.3 Failover scénáře

- Pokud feed vrátí položku se `stock=0`, přepnout variantu na `backorder`.
- Pokud položka zmizí z feedu, poslat alert (Slack/e-mail) a označit variantu jako `discontinued`.
- Logovat chyby (`supplier_order.last_error`).

## 4. Automatické odesílání objednávek

### 4.1 Hook v Medusa

- V Medusa přidat subscriber na `order.placed` nebo `order.payment_captured` event.
- Po `paid`:
  1. Načíst položky → zjistit `supplier_variant.medusa_variant_id`.
  2. Seskupit položky podle dodavatele.
  3. Vytvořit `supplier_order` se stavem `queued`.
  4. Vyvolat job (BullMQ) pro odeslání objednávky (REST/CSV/SFTP dle dodavatele).

### 4.2 Tracking

- Dodavatel vrací tracking číslo → zapisuje se `supplier_order.tracking_number`, update `order.fulfillment`
- Chyby posílat do Slacku / e-mailu.

## 5. Implementační kroky

1. **Schema & migrace** — vytvořit entity, repository, service + GraphQL/REST endpoints (admin) pro správu supplierů.
2. **Importer** — přidat `zod` validační schémata pro priority dodavatele, transform nových produktů, CLI `pnpm --filter importer run`.
3. **Monitoring** — logy posílat do Elastic/Datadog, alerty (Better Stack) při chybě importu.
4. **Testing** — připravit fixture feedy + integrační test (vitest/ava?).

## 6. CLI a cron příklady

```bash
# Jednorázový import
IMPORTER_CONFIG='[{"id":"legend","name":"Legend Dice","type":"json","endpoint":"https://...","authToken":"..."}]' pnpm --filter importer run

# Crontab (Linux/macOS)
0 */6 * * * cd /path/to/repo && IMPORTER_CONFIG='...' pnpm --filter importer run >> importer.log 2>&1
```

## 7. TODO checklist

- [x] Vydefinovat TypeORM entity + migrace (skeleton vytvořen v apps/medusa/src/modules/supplier).
- [x] Implementovat Services/Repositories v Medusa (skeleton `SupplierSyncService` / vila loader).
- [ ] Přidat validační schémata a transformace pro prvního dodavatele.
- [ ] Přidat Slack/e-mail alerting.
- [ ] Implementovat supplier_order dispatch.
- [ ] Přidat integrační testy.
