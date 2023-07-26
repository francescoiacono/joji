import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { SocketProvider } from '@/providers';

export const metadata: Metadata = {
  title: 'Joji',
  description: ''
};

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={nunito.className}>
      <body>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
