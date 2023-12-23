import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import CartProvider from '@/providers/CartProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kesä Perhonen',
  description:
    'The official site for Kesä Perhonen, Ltd. Shop for home décor, ...15% off your first order when you sign up to our newsletter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={`${inter.className} text-slate-700`}>
        <CartProvider>
          <div className='flex flex-col min-h-screen'>
            <NavBar />
            <main className='flex-grow bg-slate-50'>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
