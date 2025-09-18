import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-6 px-6 py-16">
      <header>
        <p className="text-sm uppercase tracking-[0.4em] text-brand-light">
          Fáze 1 • Headless Stack
        </p>
        <h1 className="mt-4 text-4xl font-semibold">
          Drak &amp; Kostky headless storefront
        </h1>
      </header>
      <p className="text-slate-300">
        Toto je základní skeleton Next.js aplikace připravený pro integraci s Medusa backendem.
        Kód se nasazuje na Vercel a obsahuje připravené tailwind nastavení včetně tmavého režimu.
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs/phase1"
          className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-brand-light"
        >
          Dokumentace Fáze 1
        </Link>
        <a
          className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 hover:border-brand-light"
          href="https://docs.medusajs.com/"
          target="_blank"
          rel="noreferrer"
        >
          Medusa Docs
        </a>
      </div>
    </section>
  );
}
