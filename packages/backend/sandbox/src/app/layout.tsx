'use client';

import { SocketProvider } from '@/components/providers/socket';
import { useEffect, useState } from 'react';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap'
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <html lang='en' className={inter.className}>
      <body>
        {isHydrated && <SocketProvider>{props.children}</SocketProvider>}
      </body>
    </html>
  );
};

export default Layout;
