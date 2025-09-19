# Drak & Kostky — Delivery Roadmap

Tento dokument převádí osm fází do konkrétních úkolů, očekávaných výstupů a doprovodných poznámek. Časové odhady odpovídají sólo práci; uprav podle dostupné kapacity.

---

## Fáze 1 — Základní infrastruktura (Týdny 1–2)

### 1.1 Headless stack & repozitář

- [ ] Rozhodnout: **Next.js 14 (App Router)** + **Medusa 1.12** jako commerce core.
- [ ] Vytvořit monorepo (`pnpm` workspace) se strukturou `apps/storefront`, `apps/admin`, `apps/medusa`.
- [ ] Inicializovat Next.js (`pnpm create next-app`) a Medusa (`pnpm dlx @medusajs/medusa new`).
- [ ] Sdílená konfigurace: ESLint, Prettier, Husky hooky (lint + test).

### 1.2 CI/CD a prostředí

- [ ] Založit Git repozitář (GitHub/GitLab).
- [ ] Nasadit `storefront` na **Vercel** (production + preview), `medusa` na **Railway/Fly.io** (pro rychlý start).
- [ ] Konfigurovat prostředí `production`, `staging`, `development` (separátní DB + API klíče).

### 1.3 Doména & DNS

- [ ] Registrovat doménu (např. `drakakostky.cz`).
- [ ] DNS spravovat přes **Cloudflare**: A/AAAA → Vercel, CNAME pro API, MX → SendGrid/Resend.
- [ ] Aktivovat HTTPS, HSTS preload, základní WAF pravidla.

### 1.4 Transakční e-maily

- [ ] Vytvořit účet **Resend** nebo **SendGrid**.
- [ ] Generovat API klíč + SMTP credentials; uložit do `1Password`/vaultu.
- [ ] Ověřit doménu (SPF, DKIM, DMARC) a otestovat odeslání (`curl`/`resend send`).

**Milníky:**

- ✅ Monorepo + CI lint/test.
- ✅ Nasazený Next.js + Medusa (staging) UI „Hello world”.
- ✅ Funkční transakční e-mail (test doručen).

---

## Fáze 2 — Integrace dodavatelů (Týdny 2–4)

### 2.1 Analýza feedů & model

- [ ] Získat specifikaci dodavatelů (REST/CSV/XML, autentizace).
- [ ] Navrhnout tabulky `supplier_products`, `supplier_variants`, `stock_snapshots`.
- [ ] Definovat mapování: SKU ⇄ variant, EAN/ISBN, měna, daně.

### 2.2 Importní worker

- [ ] Node/TypeScript service (`apps/importer`), cron (BullMQ/Temporal/self cron).
- [ ] Funkce: stáhnout feed → normalizovat → upsert do Medusa (`product`, `variant`, `price`, `inventory`).
- [ ] Logging (Pino) + alert (e-mail/Slack) při chybě.
- [ ] Frekvence: 4× denně + ruční trigger (CLI command `pnpm importer:run`).

### 2.3 Odesílání objednávek

- [ ] Po `paid` objednávce vytvořit payload pro dodavatele (API/e-mail + CSV).
- [ ] Implementovat retry/backoff, stav `supplier_pending`, `supplier_failed`.
- [ ] Fallback scénář: položka `out_of_stock` → notifikace supportu, refund/ náhrada.

**Milníky:**

- ✅ První import kompletně vytvoří produkty v Medusa.
- ✅ Chybový log + alert běží (test provozního incidentu).
- ✅ Objednávka po zaplacení dorazí dodavateli (sandbox).

---

## Fáze 3 — Katalog & frontend (Týdny 4–6)

### 3.1 Struktura katalogu

- [ ] Kategorie: Kostky, Miniatury, Knihy, Doplňky, Podložky, DM Gear.
- [ ] Atributy: typ kostky (d4-d20), materiál, edice, jazyk, značka, kompatibilita.
- [ ] Produkt šablony: galerie, variant selector, recommended (cross/upsell).

### 3.2 CMS/Medusa napojení

- [ ] Use-case 1: CMS (Sanity) pro obsah + popisy → Next.js používá GraphQL/REST k Medusa.
- [ ] Use-case 2: Rich text & metadata v Medusa (Product Collection, Product Tags, Metadata fields).

### 3.3 Vyhledávání

- [ ] Deploy **Meilisearch** (Managed nebo Vercel Edge function) či Algolia.
- [ ] Sync produktů skriptem (webhook z Medusa → index refresh).
- [ ] Implementovat našeptávač, fuzzy match, suggestions, recommended bundles.

### 3.4 Frontend UX/UI

- [ ] Tailwind + shadcn UI, tmavý/světlý mód (`next-themes`).
- [ ] Mini-cart (drawer), 1-page checkout skeleton.
- [ ] Lokalizace CZ/EN via `next-intl`, dynamic routing (`/[locale]/...`).
- [ ] SEO komponenty: `<head>` metadata, OpenGraph, schema.org Product, sitemap, robots.

**Milníky:**

- ✅ V produkci základní katalog + detail produktu.
- ✅ Filtrování (kombinace atributů) + vyhledávání <200ms.
- ✅ Lighthouse performance >85, accessibility >90.

---

## Fáze 4 — Checkout, platby, doprava (Týdny 6–8)

### 4.1 Platby

- [ ] Integrace GoPay/Comgate (CZ) + Stripe (pro mezinárodní transakce).
- [ ] Apple/Google Pay aktivace, test sandbox plateb.
- [ ] Webhook processor (payment success/failure → update order state).

### 4.2 Doprava

- [ ] Servery
  - Packeta: výběr výdejního místa (widget) + API.
  - DPD/PPL/ČP: Balíkobot nebo ShipMonk.
- [ ] Dynamické poštovné dle váhy/rozměru, detekce free shipping threshold.

### 4.3 Komunikace se zákazníkem

- [ ] E-mail šablony (MJML/Handlebars): potvrzení, expedice, faktura.
- [ ] Generování PDF faktur (PDFKit) + uložení do S3/Bucket.

**Milníky:**

- ✅ Úspěšná sandbox platba, stavy `paid`, `failed` testovány.
- ✅ Packeta + kurýrní volby funkční.
- ✅ Odeslána faktura + tracking e-mail.

---

## Fáze 5 — Backend & provoz (Týdny 8–9)

### 5.1 Order workflow

- [ ] Stavy: `draft`, `pending_payment`, `paid`, `fulfillment_pending`, `shipped`, `canceled`, `refunded`.
- [ ] Role & permissions: Admin, Support, Warehouse, Marketing.
- [ ] Audit log (každá změna stavu, uživatel, timestamp).

### 5.2 Monitoring & zálohy

- [ ] Uptime monitoring (Better Stack) s alerty (Slack/SMS).
- [ ] Datadog/NewRelic pro performance + error tracking (Sentry).
- [ ] Zálohy Postgres (pgBackRest) a S3 (daily snapshot+ retention). Test restore.
- [ ] Healthcheck endpointy pro cron/importer.

**Milníky:**

- ✅ Admin UI se stavovým workflow.
- ✅ Alert při výpadku / chybě integrace.
- ✅ Ověřená obnova z backupu.

---

## Fáze 6 — Marketing & analytika (Týdny 9–10)

### 6.1 Analytics

- [ ] GA4 integrace (Next.js GTM), e-commerce eventy (view_item, add_to_cart, purchase).
- [ ] Server-side GTM / Meta Conversion API (cloud function + hashed PII).
- [ ] Dashboard KPI (Metabase/Looker Studio).

### 6.2 Marketing automations

- [ ] CMS stránky: FAQ, Doprava & platba, Velikost kostek, Jak vybrat set.
- [ ] Newsletter (Brevo/Klaviyo) + double opt-in, segmentace.
- [ ] Opuštěný košík, post-purchase upsell, welcome flow.
- [ ] Kupóny, dárkové poukazy, produktové bundly.

**Milníky:**

- ✅ GA4 sbírá data + konverze.
- ✅ Automatizace e-mailu běží (test kampaně).
- ✅ Kupón a bundle vytvořené v Admin UI.

---

## Fáze 7 — Zákaznická péče & bezpečnost (Týdny 10–11)

### 7.1 Support

- [ ] Chat widget (Tidio/LiveChat), integrace do Next.js.
- [ ] Helpdesk (HelpScout) propojený s objednávkami.
- [ ] RMA proces (formulář, ticket, sklad → dodavatel).

### 7.2 Bezpečnost & compliance

- [ ] reCAPTCHA/hCaptcha na formulářích.
- [ ] Role/permissions v adminu, audit log unify.
- [ ] GDPR: cookie consent, zpracovatelské smlouvy, privacy policy.

**Milníky:**

- ✅ Support kanály aktivní.
- ✅ RMA request → ticket → vyřízení testováno.
- ✅ Pen-test checklist (OWASP top 10) projito.

---

## Fáze 8 — Testování & launch (Týdny 11–12)

### 8.1 Testing

- [ ] End-to-end testy (Playwright) pro importy, košík, checkout, e-maily.
- [ ] Sandbox platby, doprava, e-mail (písemný protokol).
- [ ] Load test (k6, 100 uživatelů, p95 <400 ms) + Lighthouse >85.

### 8.2 Launch

- [ ] UAT / soft launch (vybraná komunita), sběr feedbacku.
- [ ] Monitoring KPI (konverze, fulfilment SLA, chybovost importů).
- [ ] Full marketing rollout, připravený rollback plán.

**Milníky:**

- ✅ Test report bez blockerů.
- ✅ Soft launch OK, metriky stabilní.
- ✅ Ostrý start + monitoring běží.

---

## Přílohy

- Doporučené nástroje: pnpm, Turborepo, Docker Compose, BullMQ/Temporal, Sentry, Datadog, Better Stack, Meilisearch, Resend, Sanity, Tailwind, shadcn, Algolia/Meilisearch, Packeta API, Balíkobot.
- Doporučený vault pro tajemství: 1Password CLI / Doppler / Vault.
- Komunikační kanály: Slack (incident), Linear/Jira (issue tracking), Notion (dokumentace).
