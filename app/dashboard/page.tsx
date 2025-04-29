import { PostType } from '../lib/definitions';
import { getLatestPosts } from './data';
import LatestPosts from '../ui/dashboard/latestPosts';
import Intro from '../ui/dashboard/intro';

const Page = async () => {
  const data: PostType[] = await getLatestPosts();

  return (
    <main>
      <div>
        <h1 className='text-4xl font-bold mb-9 dark:h1-darkmode text-center'>
          ✵ Welcome to Tegachan! ✵
        </h1>
        <Intro />
      </div>
      <LatestPosts posts={data} />
    </main>
  );
};

export default Page;