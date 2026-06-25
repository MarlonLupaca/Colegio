import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'Colegio Smart - Portal Educativo',
  description: 'Portal oficial de gestión de estudiantes, docentes y administración del Colegio Smart.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sidebar-bg">{children}</body>
    </html>
  );
}
