import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/app/context/LanguageContext'; // IMPORTAMOS ESTO

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
        {/* ENVOLVEMOS A LOS CHILDREN */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
