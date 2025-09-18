import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Drak & Kostky | Storefront',
  description: 'Headless Next.js storefront pro Dungeons & Dragons doplňky.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
