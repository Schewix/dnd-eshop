import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drak & Kostky | Storefront',
  description: 'Headless Next.js storefront pro Dungeons & Dragons doplňky.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
    shortcut: '/icon.svg',
  },
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
