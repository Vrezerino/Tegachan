import { CatalogOPType, PostType } from '@/app/lib/definitions';
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
  const posts = (await getBumpedPosts(sanitizedBoardName) ?? []) as CatalogOPType[];

  return (
    <main>
      <header>
        <h1
          className='bronzeShadow text-3xl text-sky-700 font-bold mb-3 dark:header-darkmode text-center'
          data-testid='board-name-header'>
          ✵ {result.name.toUpperCase()} ✵
        </h1>
      </header>
      <p
        className='text-xs wrap-anywhere text-center mb-5 font-normal text-neutral-600/60 dark:text-neutral-300/60'
        data-testid='board-description'
      >{result.desc}
      </p>
      <Board boardName={board} posts={posts} />
    </main>
  );
};

export default Page;