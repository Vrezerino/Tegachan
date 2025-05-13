import { PostType } from '@/app/lib/definitions';
import { getLatestPosts } from './data';
import LatestPosts from '@/app/ui/dashboard/latestPosts';
import Intro from '@/app/ui/dashboard/intro';

const Page = async () => {
  const data: PostType[] = await getLatestPosts();

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
      <LatestPosts posts={data} />
    </main>
  );
};

export default Page;