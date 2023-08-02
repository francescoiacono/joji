import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { SocketProvider, RoomProvider } from '@/components/providers';

import '@/theme/styles/reset.linaria.global';
import '@/theme/styles/globals.linaria.global';

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
        <SocketProvider>
          <RoomProvider>{children}</RoomProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
