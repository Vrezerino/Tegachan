import { PostType } from '@/app/lib/definitions';
import { getPost } from './data';
import Post from '@/app/ui/dashboard/post';
import { notFound, redirect } from 'next/navigation';

type ParamsType = Promise<{ board: string; postNum: string }>;

const Page = async ({ params }: { params: ParamsType }) => {
  // Asynchronous access of params is now necessary
  const { board, postNum } = await params;

  const data: PostType = await getPost(board, postNum.toString());
  if (Object.keys(data).length === 0) notFound();

  /**
    If the post is not OP (thread starter), don't allow single post view,
    redirect to parent thread instead 
  */
  if (!data.OP) redirect(`/dashboard/${data.board}/${data.thread}`);

  return (
    <Post post={data} />
  );
};

export default Page;