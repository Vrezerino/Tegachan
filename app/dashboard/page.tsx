import { PostType } from '@/app/lib/definitions';
import { getLatestPosts } from './data';
import LatestPosts from '@/app/ui/dashboard/latestPosts';
import Intro from '@/app/ui/dashboard/intro';

const Page = async () => {
  const data: PostType[] = await getLatestPosts();

  return (
    <main>
      <div>
        {/** Header won't be surrounded by stars in mobile devices i.e. screens narrower than 767 px */}
        <h1 className='text-3xl font-bold mb-9 dark:header-darkmode text-center xsm:hidden'>
          ✵ Welcome to Tegachan! ✵
        </h1>
        <h1 className='text-3xl font-bold dark:header-darkmode text-center xsm:block hidden'>
          Welcome to Tegachan!
        </h1>
        <h1 className='text-6xl font-bold m-4 dark:header-darkmode text-center xsm:block hidden'>
          ✵
        </h1>
        <Intro />
      </div>
      <LatestPosts posts={data} />
    </main>
  );
};

export default Page;