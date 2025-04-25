import { PostType } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

const LatestPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className='w-full max-w-md p-3 bg-white border border-gray-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-4'>
        <h5 className='my-0 mx-auto text-xl font-bold leading-none text-gray-900 dark:text-white'>Latest Posts</h5>
      </div>
      <div className='flow-root m-0'>
        <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
          {posts?.map((post) => (
            <li className='py-2 sm:py-3' key={post.postNum}>
              <div className='flex items-center'>
                <div className='shrink-0'>
                  {post?.imageUrl && <Image src={post?.imageUrl} alt={post.title || ''} width={32} height={32} />}
                </div>
                <div className='flex-1 min-w-0 ms-1'>
                  {/* Link to threadnum and #postnum if post is not an OP, otherwise just postnum */}
                  <Link href={`dashboard/${post?.board}${post?.thread ? '/' + post.thread + '#' : '' + '/'}${post?.postNum}`}>
                    <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
                      {post?.title}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      {post?.content}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      {new Date(post?.date).toUTCString()}
                    </p>
                  </Link>
                </div>
                <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                  <Link href={`dashboard/${post?.board}`}>/{post?.board}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LatestPosts;