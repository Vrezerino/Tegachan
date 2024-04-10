import Link from 'next/link';
import Image from 'next/image';
import { getRandomInt } from '@/app/lib/utils';

const NotFound = () => {
    return (
        <div className='flex flex-col bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-neutral-900'>
            <div className='min-w-48 relative xsm:hidden'>
                <Image
                    src={`/img/misc/ohno${getRandomInt(6)}.jpg`}
                    alt='Person being frustrated at 404 error'
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
                <h1 className='text-3xl font-bold dark:h1-darkmode'>404 - Not Found!</h1>
                <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>The requested post was not found.</p>
                <Link
                    href={'/dashboard'}
                    className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3'>
                    <h3>Return to Dashboard</h3>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;