import { PostType } from '@/app/lib/definitions';
import { getBumpedPosts } from './data';

import Board from '@/app/ui/dashboard/board';
import { notFound } from 'next/navigation';
import { links, sanitizeString } from '@/app/lib/utils';

type ParamsType = Promise<{ board: string; }>;

const Page = async ({ params }: { params: ParamsType }) => {
  // Asynchronous access of params is now necessary
  const { board } = await params;
  const sanitizedBoardName = sanitizeString(board);

  // Render 404 page if board name in request doesn't refer to an existing board
  //const regex = new RegExp('\\b' + sanitizedBoardName + '\\b');
  const result = links.find((l) => l.href.split('/')[2] === sanitizedBoardName);
  if (!result) notFound();

  // Get thread starter posts from given board
  const data: PostType[] = await getBumpedPosts(sanitizedBoardName);

  //if (!regex.test(boards)) notFound();

  return (
    <>
      <h1 className='text-4xl font-bold mb-9 dark:h1-darkmode text-center'>✵ {result.name} ✵</h1>
      <Board posts={data} />
    </>
  );
};

export default Page;