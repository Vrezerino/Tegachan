import { PostType } from '@/app/lib/definitions';
import { getPost } from '@/app/lib/posts';
import Post from '@/app/ui/dashboard/post';
import { notFound } from 'next/navigation';

type PostParams = {
    params: {
        board: string;
        postNum: number;
    }
}

const Page = async ({ params }: PostParams) => {
    const data: PostType = await getPost(params.board, params.postNum);
    if (!data) notFound();

    return (
        <Post post={data}/>
    )
}

export default Page;