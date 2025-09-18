# Fáze 1 — Základní infrastruktura

Tento dokument popisuje dokončené kroky v rámci Fáze 1 a další akce, které proběhnou mimo tento repozitář (doména, DNS, e-maily).

## 1. Headless stack & monorepo

- [x] Zvolen stack **Next.js 14** (App Router) + **Medusa 1.12**.
- [x] Vytvořena monorepo struktura s `pnpm-workspace.yaml` a složkami `apps/storefront`, `apps/admin`, `apps/medusa`.
- [x] Přidané základní `package.json` soubory a skripty pro běh (`pnpm dev`, `pnpm --filter <app> dev`).
- [x] Legacy prototyp přesunut do `legacy-prototype/` pro referenci.

## 2. CI/CD a prostředí

> Akce vyžadující externí služby nejsou součástí repozitáře, níže je postup:

1. **Git hosting** – založ GitHub/GitLab repozitář a pushni aktuální stav.
2. **Vercel** – propojit `apps/storefront`, nastavit `STAGING` a `PRODUCTION`, environment proměnné:
   - `NEXT_PUBLIC_MEDUSA_URL`, `NEXT_PUBLIC_SITE_URL`.
3. **Medusa host** – Railway/Fly.io: deploy `apps/medusa`, nastav `DATABASE_URL`, `REDIS_URL`, `RESEND_API_KEY` apod.
4. **Staging** – separátní databáze + Resend sandbox klíč.

## 3. Doména & DNS

Postup mimo repo:

1. Registrovat `drakakostky.cz` (nebo variantu).
2. DNS spravovat přes Cloudflare.
   - A/CNAME → Vercel (storefront).
   - CNAME `api` → Medusa host.
   - MX → Resend/SendGrid (viz dokumentace).
3. Aktivovat HTTPS (auto), přidat HSTS, WAF pravidla (ratelimiting adminu).

## 4. Transakční e-maily

1. Resend/SendGrid účet → ověřit doménu (SPF, DKIM, DMARC).
2. Do Vercel / Medusa hostingu zadat `RESEND_API_KEY` a `RESEND_FROM`.
3. Otestovat odeslání (např. `curl https://api.resend.com/emails` se sample payloadem).

## 5. Další doporučení

- Založ 1Password/Doppler na správy tajemství.
- Připrav GitHub Actions workflow (lint + build) po instalaci závislostí.
- Naplánuj zapojení Sentry/Datadog v dalších fázích.

> Po dokončení výše uvedeného je Fáze 1 formálně hotová a je možné pokračovat do Fáze 2 (integrace feedů dodavatelů).
