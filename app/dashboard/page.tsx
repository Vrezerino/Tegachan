import { PostType } from '@/app/lib/definitions';
import { getLatestPosts } from './data';
import LatestPosts from '@/app/ui/dashboard/latestPosts';
import Intro from '@/app/ui/dashboard/intro';

import Parser from 'rss-parser';
import { RSS_FEED_URL } from '../lib/env';
import NewsFeed from '../ui/dashboard/newsFeed';
import { NewsItem } from '@/app/lib/definitions';

const parser: Parser<NewsItem> = new Parser<NewsItem>();

const Page = async () => {
  const data = (await getLatestPosts() ?? []) as PostType[];
  const feed = ((await parser.parseURL(RSS_FEED_URL)).items ?? []) as NewsItem[];


  return (
    <main>
      <div>
        <h1 className='text-6xl text-sky-700 font-bold dark:header-darkmode text-center'>
          TEGACHAN
        </h1>
        <h1 className='text-4xl text-sky-700 m-5 dark:header-darkmode text-center'>
          ✵
        </h1>
        <Intro />
      </div>
      <div className='flex items-start flex-col md-big:flex-row justify-center max-w-[1480px] mx-auto'>
        <LatestPosts posts={data} />
        <NewsFeed items={feed} />
      </div>
    </main>
  );
};

export default Page;