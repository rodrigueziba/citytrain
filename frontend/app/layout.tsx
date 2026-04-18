import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Cargamos la fuente Inter (es súper moderna y legible)
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ushuaia City Train',
  description: 'Reserva tu viaje en el tren del fin del mundo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
