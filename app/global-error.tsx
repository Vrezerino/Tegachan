'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRandomInt } from './lib/utils';

// Specifically handle errors in root layout (layout.tsx)
const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  /**
   * Unlike the root error.js, the global-error.js error boundary wraps the entire application,
   * and its fallback component replaces the root layout when active. Because of this, it is
   * important to note that global-error.js must define its own <html> and <body> tags.
   *
   * Even if a global-error.js is defined, it is still recommended to define a root error.js whose
   * fallback component will be rendered within the root layout, which includes globally shared UI
   * and branding.
   */
  return (
    <html>
      <body>
        <div className='flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-neutral-900'>
          <div className='min-w-40 relative xsm:hidden'>
            <Image
              src={`/img/misc/ohno${getRandomInt(6)}.jpg`}
              alt='Person being frustrated at error'
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'left top'
              }}
              placeholder='blur'
              blurDataURL='/img/misc/blurred.jpg'
              className='object-cover rounded-tl-lg' />
          </div>
          <div className='flex flex-col justify-between p-4 leading-normal'>
            <h1 className='text-3xl font-bold'>Something went wrong!</h1>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>{error?.message}</p>
            <Link
              href={'/dashboard'}
              className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3'>
              <h3>Return to Dashboard</h3>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}

export default GlobalError;