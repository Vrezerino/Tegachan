import { PostType } from '@/app/lib/definitions';
import { getPost } from './data';
import Post from '@/app/ui/dashboard/post';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type ParamsType = Promise<{ board: string; postNum: string }>;

const Page = async ({ params }: { params: ParamsType }) => {
  // Asynchronous access of params is now necessary
  const { board, postNum } = await params;

  const data = (await getPost(board, postNum.toString()) ?? []) as PostType[];
  if (Object.keys(data).length === 0) notFound();

  return (
    <main>
      <Post posts={data} />
      <Link href={`/${board}`}>
        <p className='text-xs wrap-anywhere text-center mb-5 font-normal text-neutral-600/60 dark:text-neutral-300/60' data-testid='back-to-board-link'>⇽ Back to {'/' + board}</p>
      </Link>
    </main>
  );
};

export default Page;