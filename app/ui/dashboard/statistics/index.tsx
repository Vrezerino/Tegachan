'use client'

import { StatisticsType } from '@/app/lib/definitions';

const Statistics = ({ statistics }: { statistics: StatisticsType }) => {
  return (
    <section
      className='mx-auto mb-3 w-full max-w-md p-2 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800'
      aria-labelledby='statistics-heading'
    >
      <header>
        <h5
          id='statistics-heading'
          className='mb-5 mx-auto text-xl text-center font-bold leading-none text-neutral-900 dark:header-darkmode'
        >STATS
        </h5>
      </header>

      <p className='text-sm font-medium text-neutral-900 dark:text-white' data-testid='total-posts-count'>
        Total posts: <b>{statistics.postCount}</b>
      </p>
      <p className='text-sm font-medium text-neutral-900 dark:text-white' data-testid='unique-posters-count'>
        Unique posters: <b>{statistics.uniqueIps}</b>
      </p>
      <p className='text-sm font-medium text-neutral-900 dark:text-white' data-testid='total-content-size'>
        Total content: <b>{Number(statistics.activeContentSize || 0).toFixed(4)} MB</b>
      </p>
    </section>
  );
};

export default Statistics;
