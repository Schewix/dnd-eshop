# Drak & Kostky — Headless e-commerce monorepo

Tento repozitář byl během Fáze 1 transformován do monorepa se stackem **Next.js 14 + Medusa 1.12**. Legacy prototyp (statická stránka + mock backend) zůstal v `legacy-prototype/` pro referenci.

## Struktura

```
.
├── apps/
│   ├── storefront/   # Next.js App Router skeleton + Tailwind
│   ├── admin/        # Placeholder pro budoucí administrační UI
│   └── medusa/       # Medusa backend s konfigurací a seed hooky
├── docs/             # Roadmapa, Fáze 1 instrukce
├── legacy-prototype/ # Původní statický prototyp (HTML/JS)
├── package.json      # pnpm workspace skripty
└── pnpm-workspace.yaml
```

## Lokální spuštění (po instalaci závislostí)

```bash
pnpm install
pnpm dev:medusa    # v jiném terminálu (vyžaduje Postgres + Redis)
pnpm dev:storefront
```

> Medusa část není součástí této fáze plně nakonfigurovaná – použij `.env.example` a přidej vlastní `DATABASE_URL`, `REDIS_URL`.

## Deployment checklist (Fáze 1)

- [ ] GitHub/GitLab repozitář + CI (lint/build) — viz `docs/phase1.md`.
- [ ] Vercel projekt pro `apps/storefront` (production + preview environments).
- [ ] Railway/Fly.io projekt pro `apps/medusa` (separátní DB pro staging/production).
- [ ] Registrace domény, DNS přes Cloudflare, nastavení MX pro Resend/SendGrid.
- [ ] Konfigurace transakčních e-mailů (RESEND/SendGrid API key) a test odeslání.

## Další kroky

Pokračuj Fází 2 dle `docs/roadmap.md` – integrace dodavatelských feedů a import worker.
