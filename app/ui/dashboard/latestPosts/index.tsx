import { PostType } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

const LatestPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className='w-full max-w-md p-3 bg-white border border-gray-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-4'>
        <h5 className='my-0 mx-auto text-xl font-bold leading-none text-gray-900 dark:header-darkmode'>Latest Posts</h5>
      </div>
      <div className='flow-root m-0'>
        <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
          {posts?.map((post) => (
            <li className='py-2 sm:py-3' key={post.post_num}>
              <div className='flex items-start'>
                <div className='shrink-0 mt-[5px]'>
                  {post?.image_url && <Image
                    src={post?.image_url}
                    alt={post.title || ''}
                    // className will determine final size so these are practically compression levels, higher is better
                    width={20}
                    height={20}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'left top'
                    }}
                    unoptimized={post.image_url.includes('.gif')}
                    className='max-h-[60px] w-[32px]' />}
                </div>
                <div className='flex-1 min-w-0 ms-1'>
                  {/* Link to threadnum#post_num if post is not an OP, otherwise just post_num */}
                  <Link href={`/${post?.board}${!post?.is_op ? '/' + post.thread + '#' : '' + '/'}${post?.post_num}`}>
                    <p className='text-sm font-medium text-gray-900 truncate dark:text-white mt-0'>
                      {post?.title}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      {post?.content}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      {new Date(post?.created_at).toUTCString()}
                    </p>
                  </Link>
                </div>
                <div className='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                  <Link href={`/${post?.board}`}>/{post?.board}</Link>
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