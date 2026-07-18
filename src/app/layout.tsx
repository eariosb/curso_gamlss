import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'GAMLSS: Regresión Distribucional Aplicada | Curso Interactivo',
  description:
    'Curso interactivo sobre Modelos Aditivos Generalizados para Localización, Escala y Forma (GAMLSS), con aplicaciones en seguros de crédito y caución, inventarios, control de calidad, confiabilidad y biología. Universidad Nacional de Colombia, sede Medellín.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
