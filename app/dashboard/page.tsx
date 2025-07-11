import { PostType, StatisticsType } from '@/app/lib/definitions';
import { getLatestPosts, getStatistics } from './data';
import LatestPosts from '@/app/ui/dashboard/latestPosts';
import Intro from '@/app/ui/dashboard/intro';

import Parser from 'rss-parser';
import { RSS_FEED_URL } from '@/app/lib/env';
import NewsFeed from '@/app/ui/dashboard/newsFeed';
import { NewsItem } from '@/app/lib/definitions';
import Statistics from '@/app/ui/dashboard/statistics';
import Updates from '@/app/ui/dashboard/updates';

const parser: Parser<NewsItem> = new Parser<NewsItem>();

const Page = async () => {
  const posts = (await getLatestPosts() ?? []) as PostType[];
  const statistics = (await getStatistics() ?? []) as StatisticsType;
  const feed = ((await parser.parseURL(RSS_FEED_URL)).items ?? []) as NewsItem[];

  return (
    <main>
      <header>
        <h1 className='bronzeShadow text-6xl text-sky-700 font-bold dark:header-darkmode text-center'>
          TEGACHAN
        </h1>
      </header>
      <p
        className='bronzeShadow text-4xl text-sky-700 m-5 dark:header-darkmode text-center'
        aria-label='star symbol'
      >
        ✵
      </p>
      <aside>
        <Intro />
        <Updates />
        <Statistics statistics={statistics} />
      </aside>
      <section className='flex items-start flex-col md-big:flex-row justify-center max-w-[1430px] mx-auto'>
        <LatestPosts posts={posts} />
        <NewsFeed items={feed} />
      </section>
    </main>
  );
};

export default Page;