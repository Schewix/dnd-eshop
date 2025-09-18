# Drak & Kostky — Headless e-commerce monorepo

Monorepo se stackem **Next.js 14 + Medusa 1.12**. Legacy prototyp (statická stránka + mock backend) je v `legacy-prototype/`.

## Struktura

```
.
├── apps/
│   ├── storefront/   # Next.js App Router skeleton + Tailwind
│   ├── admin/        # Placeholder pro budoucí administrační UI
│   ├── medusa/       # Medusa backend s konfigurací a seed hooky
│   └── importer/     # Node/TS worker pro synchronizaci dodavatelských feedů
├── docs/             # Roadmapa, Fáze 1-2 instrukce
├── legacy-prototype/ # Původní statický prototyp (HTML/JS)
├── docker-compose.yml
├── package.json      # pnpm workspace skripty
└── pnpm-workspace.yaml
```

## Lokální spuštění

```bash
# závislosti
pnpm install

# infrastrutura
docker-compose up -d  # Postgres + Redis

# medusa backend (vyžaduje .env podle apps/medusa/.env.example)
pnpm dev:medusa

# storefront
pnpm dev:storefront
```

## Importer (Fáze 2)

Importer čte konfig z proměnné `IMPORTER_CONFIG` (JSON) a stahuje feedy dodavatelů.

```bash
# příklad lokálního spuštění
IMPORTER_CONFIG='[{"id":"demo","name":"Demo","type":"json","endpoint":"https://example.com/feed.json"}]' pnpm --filter importer run
```

Konfiguraci a datový model najdeš v `docs/phase2.md`.

## Deployment checklist

- [ ] GitHub/GitLab repozitář + CI (lint/build) — viz `docs/phase1.md`.
- [ ] Vercel projekt pro `apps/storefront`.
- [ ] Railway/Fly.io pro `apps/medusa` (DB, Redis).
- [ ] Doména + DNS (Cloudflare), MX pro Resend/SendGrid.
- [ ] Transakční e-maily (RESEND API key) a test odeslání.
- [ ] Nasazení importeru (cron job / serverless / container) podle `docs/phase2.md`.

## Další kroky

Pokračuj dle `docs/roadmap.md` – nyní rozpracována Fáze 2 (integrace feedů a automatizace objednávek).
