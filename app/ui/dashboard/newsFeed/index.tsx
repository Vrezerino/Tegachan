import { NewsItem } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import Link from 'next/link';

const NewsFeed = ({ items }: { items: NewsItem[] }) => {
  return (
    <div className='w-full mx-auto max-w-[700px] p-3 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800'>
      <div className='flex items-center justify-between mb-4'>
        <h5 className='my-0 mx-auto text-xl font-bold leading-none text-neutral-900 dark:header-darkmode'>NEWS</h5>
      </div>
      <div className='flow-root m-0'>
        <ul role='list' className='divide-y divide-neutral-200 dark:divide-neutral-700' data-testid='news-items'>
          {items?.filter(post => post.creator !== 'TechCrunch Events').slice(0, 10).map((item, i) => (
            <li className='py-2 sm:py-3' key={i} data-testid='news-item'>
              <div className='flex items-start' data-testid='news-item-container'>
                <div className='flex-1 min-w-0 ms-1'>
                  <Link
                    href={parseUrl(item.link!)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <p className='text-xs font-bold wrap-anywhere' data-testid='news-item-info'>
                      <span className='text-sm text-neutral-900 dark:text-white'>{item.title}</span>
                      <br />
                      <span className='text-neutral-500 dark:text-neutral-400'>{parseDate(item.pubDate!)}</span>
                    </p>
                    <br />

                    <p className='text-xs text-neutral-500 wrap-anywhere dark:text-neutral-400' data-testid='news-item-content'>
                      {item.contentSnippet}
                    </p>
                  </Link>
                </div>
                {/*<div className='inline-flex items-center text-base font-semibold text-neutral-900 dark:text-white'>
                  category maybe?
                </div>*/}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsFeed;