'use client' // Error components must be Client Components

import Link from 'next/link';
import { useEffect } from 'react';
import { getRandomInt } from '@/app/lib/utils';
import Image from 'next/image';

/**
 * Catch unexpected errors that occur in Server Components and
 * Client Components and display a fallback UI
 * @param param0
 * @returns
 */
const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  }, [error])


  return (
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
        <h3 className='text-3xl font-bold mb-4 dark:header-darkmode'>Something went wrong!</h3>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>{error?.message}</p>
        <Link
          href={'/'}
          className='rounded-md p-3 border border-orange-200/50 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3'>
          Return to index
        </Link>
      </div>
    </div>
  );
};

export default Error;