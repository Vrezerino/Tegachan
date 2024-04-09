import { PostType } from '@/app/lib/definitions';
import { getBumpedPosts } from '@/app/api/posts/route';

import Board from '@/app/ui/dashboard/board';
import { notFound } from 'next/navigation';
import { boards } from '@/app/lib/utils';

type BoardParams = {
    params: {
        board: string;
    }
}

const Page = async ({ params }: BoardParams) => {
    // Get thread starter posts from given board
    const data: PostType[] = await getBumpedPosts(params.board);

    // Render 404 page if board name in request doesn't refer to an existing board
    if (!(boards.includes(params.board))) notFound();

    return (
        <Board posts={data}/>
    )
}

export default Page;