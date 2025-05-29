import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import '@/app/globals.css';
import NextTopLoader from 'nextjs-toploader';
import Particles from '@/app/ui/dashboard/particles';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

// Local fonts must be under /app folder, not /public
// Use directly in globals.css, font-family: var(--font-apparelBoldModified);
const apparelBoldModified = localFont({
  src: './lib/fonts/ApparelBoldModified.otf',
  variable: '--font-apparelBoldModified'
});

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
    <html id='top' lang='en'>
      <body className={`${inter.variable} ${apparelBoldModified.variable} dark:body-dark font-[var(--font-inter)]`}>
        <NextTopLoader color='white' height={9}/>
        <Particles />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;