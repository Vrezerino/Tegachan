'use client';

import { useState, useEffect } from 'react';
import { PostType } from '@/app/lib/definitions';
import { getFlagEmoji, parseDate } from '@/app/lib/utils';
import CancelIcon from '@/public/img/misc/cancel.svg';
import Link from 'next/link';
import toast from 'react-hot-toast';

const SearchForm = () => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [results, setResults] = useState<PostType[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Debounce only when searching
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      const trimmed = debouncedQuery.trim();

      // No debounce when query too short or empty
      if (query.length < 3 || trimmed.length < 3) {
        setResults([]);
        return;
      }

      const res = await fetch(`/api/posts/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (res.ok) {
        const posts = (await res.json() ?? []) as PostType[];
        setResults(posts);
      } else {
        toast.error('Error fetching results');
      }
    };

    fetchResults();
  }, [query, debouncedQuery]);

  return (
    <div
      className='md:mt-4 mx-auto text-xs text-neutral-900 dark:text-neutral-400'
      data-testid='search-container'
      aria-label='post search container'
    >
      <label className='sr-only'>Search result posts</label>
      <ul className='space-y-1 md:relative fixed md:w-full w-8/12 md:right-0 right-6 md:mt-0 mt-12'>
        {results?.map((post: PostType) => (
          <li
            key={`${post.post_num}-container`}
            className='border border-neutral-200/50 bg-white dark:bg-neutral-900 p-2 rounded'
            data-testid='search-result'
            aria-label='individual search result'
          >
            <Link href={`/${post.board}${!post.is_op ? '/' + post.thread + '#' : '' + '/'}${post.post_num}`}>
              <p className='truncate font-bold'>
                {post.name} {getFlagEmoji(post.country_code)} {parseDate(post.created_at)}
              </p>
              <p className='truncate'>{post.content}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div
        className='text-center md:my-2 mt-8 md:relative absolute'
        data-testid='search-result-count'
        aria-label='search result post count'
      >
        {results?.length >= 1 && <span><strong>{results?.length}</strong> {results?.length == 1 ? 'result' : 'results'}</span>}
      </div>

      <div className='flex flex-row items-center md:max-w-full md:ml-0 ml-[-40px]'>
        <form
          role='search'
          className='flex items-center'
          aria-label='search posts by text content'
        >
          <label htmlFor='post-search' className='sr-only'>Search posts</label>
          <input
            id='post-search'
            className='peer block w-[140px] h-3 md:h-5 rounded-md border border-neutral-200/30 bg-neutral-100 dark:bg-neutral-900 py-2 px-1 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
            type='text'
            placeholder='Search from posts'
            value={query}
            data-testid='search-field'
            onChange={(e) => setQuery(e.target.value)}
          />


          {(query?.length >= 3 || results?.length >= 3) &&
            <button
              type='button'
              className='w-[21px] h-[21px]'
              onClick={() => setQuery('')}
              aria-label='clear the search'
            >
              <CancelIcon
                className='text-black dark:text-neutral-200 ml-1 md:right-0 right-19'
                alt='Clear the searchform'
                fill='currentColor'
                src='/img/misc/cancel.svg'
                height={17}
                width={17}
              />
            </button>
          }
        </form>
      </div>
    </div>
  );
}

export default SearchForm;