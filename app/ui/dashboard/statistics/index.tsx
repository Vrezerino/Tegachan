import { StatisticsType } from "@/app/lib/definitions";

const Statistics = ({ statistics }: { statistics: StatisticsType }) => {
  console.log(statistics.activeContentSize);
  return (
    <div className='mt-0 mb-8 mx-auto w-full max-w-md p-2 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800'>
      <h5 className='mb-5 mx-auto text-xl text-center font-bold leading-none text-neutral-900 dark:header-darkmode'>STATS</h5>
      <p className='text-sm font-medium text-neutral-900 dark:text-white'>
        Total posts: <b>{statistics.postCount}</b>
      </p>
      <p className='text-sm font-medium text-neutral-900 dark:text-white'>
        Active content: <b>{Number(statistics.activeContentSize || 0).toFixed(2)} MB</b>
      </p>
      <p className='text-sm font-medium text-neutral-900 dark:text-white'>
        Unique posters: <b>{statistics.uniqueIps}</b>
      </p>
    </div>
  );
};

export default Statistics;
