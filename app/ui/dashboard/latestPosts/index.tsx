import { PostType } from '@/app/lib/definitions';
import { getFlagEmoji, parseDate } from '@/app/lib/utils';
import FormatContent from '@/app/ui/components/utils/formatContent';
import Image from 'next/image';
import Link from 'next/link';

const LatestPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <article className='w-full mx-auto max-w-[700px] p-3 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 mb-3 md-big:m-0 dark:bg-neutral-900 dark:border-neutral-800'>
      <div className='flex items-center justify-between mb-4'>
        <h5 className='my-0 mx-auto text-xl font-bold leading-none text-neutral-900 dark:header-darkmode'>LATEST POSTS</h5>
      </div>
      <div className='flow-root m-0'>
        <ul role='list' className='divide-y divide-neutral-200 dark:divide-neutral-700'>
          {posts?.map((post) => (
            <li className='py-2 sm:py-3' key={post.post_num}>
              <div className={`flex items-start`}>
                <div className='shrink-0 mt-[5px]'>
                  {post?.image_url && <Image
                    src={post.image_url}
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
                  <Link href={`/${post.board}${!post.is_op ? '/' + post.thread + '#' : '' + '/'}${post.post_num}`}>
                    <p className='text-xs font-bold text-neutral-500 wrap-anywhere dark:text-neutral-400' data-testid='latest-post-post-info'>
                      {post.name} {getFlagEmoji(post.country_code)} {parseDate(post.created_at)}
                      {post.admin && <span className='text-red-700 font-bold' data-testid='poster-is-admin'> ADMIN</span>}
                    </p>
                    <p className='text-sm text-neutral-900 truncate dark:text-white' data-testid='latest-post-post-content'>
                      <FormatContent
                        content={post.content}
                        renderLinks={false}
                        renderLinebreaks={false} />
                    </p>
                  </Link>
                </div>
                <div className='inline-flex items-center text-base font-semibold text-neutral-900 dark:text-white'>
                  <Link href={`/${post.board}`}>/{post.board}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default LatestPosts;