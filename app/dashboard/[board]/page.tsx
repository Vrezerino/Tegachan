import { PostType } from '@/app/lib/definitions';
import { getBumpedPosts } from './data';

import Board from '@/app/ui/dashboard/board';
import { notFound } from 'next/navigation';
import { boards, sanitizeString } from '@/app/lib/utils';

type BoardParams = {
    params: {
        board: string;
    }
};

const Page = async ({ params }: BoardParams) => {
    // Get thread starter posts from given board
    const data: PostType[] = await getBumpedPosts(params.board);

    // Render 404 page if board name in request doesn't refer to an existing board
    const sanitizedBoardName = sanitizeString(params.board);
    const regex = new RegExp('\\b' + sanitizedBoardName + '\\b');
    if (!regex.test(boards)) notFound();

    return (
        <>
            <h1 className='text-4xl font-bold mb-9 dark:h1-darkmode text-center'>╬ {params.board.toUpperCase()} ╬</h1>
            <Board posts={data} />
        </>
    );
};

export default Page;