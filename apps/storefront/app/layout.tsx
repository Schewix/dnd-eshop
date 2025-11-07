import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Arcane Forge | Komunitní dílna pro dobrodruhy',
  description:
    'Komunitní portál a obchod Arcane Forge nabízí kostky, příručky a zdroje pro fanoušky stolních RPG.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
      </head>
      <body className="bg-dark text-light">
        <main className="min-vh-100">{children}</main>
      </body>
    </html>
  );
}
