import { PostType } from '@/app/lib/definitions';
import { getPost } from './data';
import Post from '@/app/ui/dashboard/post';
import { notFound, redirect } from 'next/navigation';

type PostParams = {
    params: {
        board: string;
        postNum: number;
    }
};

const Page = async ({ params }: PostParams) => {
    const data: PostType = await getPost(params.board, params.postNum.toString());
    if (Object.keys(data).length === 0) notFound();

    /* 
      If the post is not OP (thread starter), don't allow single post view,
      redirect to parent thread instead 
    */
    if (!data.OP) redirect(`/dashboard/${data.board}/${data.thread}`);

    return (
        <Post post={data} />
    );
};

export default Page;