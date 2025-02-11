import Link from 'next/link';

const Intro = () => {
  return (
    <div className='mt-0 mb-16 mx-auto w-full max-w-md p-2 bg-white border border-gray-200 rounded-sm rounded-br-2xl shadow sm:p-3 dark:bg-neutral-900 dark:border-gray-700'>
      <p className='text-sm font-medium text-gray-900 dark:text-white'>
        <b>Tegachan</b> is an imageboard type discussion forum, where you can anonymously post new threads and reply to others in so-called boards, which are
        pages with their own topics. It is adviced that you make yourself familiar with rules and other information before you start posting.
      </p>
      <p className='mt-3 text-sm font-bold text-red-600 text-center'>
        <Link href={`dashboard/info`}>Rules & Info</Link>
      </p>
    </div>
  );
};

export default Intro;
