import { PostType } from '@/app/lib/definitions';
import { getPost } from './data';
import Post from '@/app/ui/dashboard/post';
import { notFound } from 'next/navigation';

type ParamsType = Promise<{ board: string; postNum: string }>;

const Page = async ({ params }: { params: ParamsType }) => {
  // Asynchronous access of params is now necessary
  const { board, postNum } = await params;

  const data: PostType[] = await getPost(board, postNum.toString());
  if (Object.keys(data).length === 0) notFound();

  return (
    <Post posts={data} />
  );
};

export default Page;