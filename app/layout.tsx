import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tegachan',
  description: 'Tegachan Imageboard',
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
        {children}
      </body>
    </html>
  );
};


export default RootLayout;