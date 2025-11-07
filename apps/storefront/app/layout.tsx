import './globals.css';
import type { Metadata } from 'next';
import { Inter, Uncial_Antiqua } from 'next/font/google';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drak & Kostky | Český D&D e-shop',
  description:
    'Drak & Kostky je český specializovaný e-shop s oficiálními Dungeons & Dragons produkty, dropshipping logistikou a podporou komunity.',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const uncialAntiqua = Uncial_Antiqua({ weight: '400', subsets: ['latin'], variable: '--font-uncial' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className={`${inter.variable} ${uncialAntiqua.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
