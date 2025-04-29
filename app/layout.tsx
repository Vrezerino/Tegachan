import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import Particles from './ui/dashboard/particles';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tegachan',
  description: 'Tegachan is an imageboard type discussion forum, free to use for everyone.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body className={`${inter.className} dark:body-dark`}>
        <NextTopLoader color='white' height={9}/>
        <Particles />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;