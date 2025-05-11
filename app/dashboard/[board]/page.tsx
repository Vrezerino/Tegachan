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
  const result = links.find((l) => l.href.split('/')[1] === sanitizedBoardName);
  if (!result) notFound();

  // Get thread starter posts from given board
  const data: PostType[] = await getBumpedPosts(sanitizedBoardName);

  return (
    <>
      <h1 className='text-3xl font-bold mb-3 dark:header-darkmode text-center'>✵ {result.name} ✵</h1>
      <p className='text-xs wrap-anywhere text-center mb-5 font-normal text-neutral-600/60 dark:text-neutral-300/60' data-testid='board-description'>{result.desc}</p>
      <Board posts={data} />
    </>
  );
};

export default Page;