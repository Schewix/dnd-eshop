# Drak & Kostky — headless e-commerce monorepo

Repozitář pro český D&D e-shop postavený na **Next.js 14** (storefront) a **Medusa 1.12** (commerce backend). Původní statický prototyp je zachován v `legacy-prototype/` jako reference.

---

## Přehled struktury

```text
.
├── apps/
│   ├── storefront/   # Next.js App Router skeleton + Tailwind, lokalizace, SEO
│   ├── admin/        # zatím placeholder pro budoucí administrační rozhraní
│   ├── medusa/       # Medusa backend (konfigurace, seed hooky, skripty)
│   └── importer/     # Node/TS worker pro synchronizaci dodavatelských feedů
├── docs/             # roadmapa + detailní instrukce k Fázím 1 a 2
├── legacy-prototype/ # původní statický e-shop s mock backendem
├── docker-compose.yml# Postgres + Redis pro lokální vývoj
├── package.json      # pnpm workspace skripty
└── pnpm-workspace.yaml
```

---

## Požadavky

- Node.js 18+ (doporučeno 20 LTS) a **pnpm** 8
- Docker Desktop (kvůli Postgres & Redis)
- Ověřené účty pro Resend/SendGrid, pokud chceš testovat e-maily

---

## Lokální spuštění (Fáze 1)

```bash
# instalace závislostí
pnpm install

# start Postgres + Redis (Docker Desktop musí běžet)
docker compose up -d    # nebo: docker-compose up -d

# Medusa backend (vyžaduje .env podle apps/medusa/.env.example)
pnpm dev:medusa

# Next.js storefront
pnpm dev:storefront
```

> Pokud používáš Compose V1, nahraď `docker compose` za `docker-compose`.

---

## Importer (Fáze 2)

Worker v `apps/importer` načítá konfiguraci z proměnné `IMPORTER_CONFIG` (JSON pole). Zobrazování konfigurace a datového modelu je popsáno v `docs/phase2.md`.

```bash
# příklad lokálního spuštění importeru
IMPORTER_CONFIG='[{"id":"demo","name":"Demo","type":"json","endpoint":"https://example.com/feed.json"}]' pnpm --filter importer run
```

Připravené soubory:

- `apps/importer/.env.example` – ukázka konfigurace
- `apps/importer/src/lib/config.ts` – validační schémata `zod`
- `apps/importer/src/tasks/importSupplierCatalog.ts` – entrypoint pro zpracování feedu (JSON/REST + TODO pro CSV/XML)

---

## Nasazení

| Oblast | Doporučení |
| ------ | ----------- |
| CI/CD | GitHub/GitLab pipeline (lint + build) — kroky v `docs/phase1.md` |
| Storefront | Vercel (production + preview) |
| Medusa | Railway / Fly.io (samostatné DB + Redis pro staging/production) |
| Importer | cron job / serverless / container dle `docs/phase2.md` |
| DNS | Cloudflare (HTTPS, HSTS, WAF, MX pro Resend/SendGrid) |

---

## Další kroky podle roadmapy

1. **Fáze 2** – dokončit integraci dodavatelů (entitní model, migrace, import worker, automatické objednávky). Viz `docs/phase2.md`.
2. **Fáze 3** – katalog & frontend (CMS, Algolia/Meilisearch, UI) — plán v `docs/roadmap.md`.
3. Pokračovat dalšími fázemi (platby, doprava, marketing…) dle dokumentace.

---

## Snadné příkazy

```bash
pnpm dev:medusa      # Medusa backend
pnpm dev:storefront  # Next.js storefront
pnpm dev:importer    # Importer (spustí run skript s aktuální konfigurací)
```

> Pro importer v ostrém provozu nastav cron, logování a alerting podle doporučení v `docs/phase2.md`.

---

## Kontakt

K dotazům a navazujícím úkolům používej dokumentaci v `docs/phase1.md`, `docs/phase2.md`, případně roadmapu. Připravené skeletony usnadní přechod do dalších fází projektu.
