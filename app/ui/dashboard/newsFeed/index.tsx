import { NewsItem } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';
import Link from 'next/link';

const NewsFeed = ({ items }: { items: NewsItem[] }) => {
  return (
    <article
      className='w-full mx-auto max-w-[700px] p-3 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800'
      aria-label='tech news section'
    >
      <header className='flex items-center justify-between mb-4'>
        <h5 className='my-0 mx-auto text-xl font-bold leading-none text-neutral-900 dark:header-darkmode'>NEWS</h5>
      </header>
      <div className='flow-root m-0'>
        <ul role='list' className='divide-y divide-neutral-200 dark:divide-neutral-700' data-testid='news-items'>
          {items?.filter(post => post.creator !== 'TechCrunch Events').slice(0, 10).map((item, i) => (
            <li className='py-2 sm:py-3' key={i} data-testid='news-item'>
              <section className='flex items-start' data-testid='news-item-container' aria-label={`news item, title: ${item.title}`}>
                <div className='flex-1 min-w-0 ms-1'>
                  <Link
                    href={parseUrl(item.link!)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <p className='text-xs font-bold wrap-anywhere' data-testid='news-item-info'>
                      <span className='text-sm text-neutral-900 dark:text-white'>
                        {item.title}
                      </span>
                      <br />
                      <time className='text-neutral-500 dark:text-neutral-400'>
                        {parseDate(item.pubDate!)}
                      </time>
                    </p>
                    <br />

                    <p
                      className='text-xs text-neutral-500 wrap-anywhere dark:text-neutral-400'
                      data-testid='news-item-content'
                      aria-label='tech news main content snippet'
                    >
                      {item.contentSnippet}
                    </p>
                  </Link>
                </div>
              </section>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default NewsFeed;