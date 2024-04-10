import { PostType } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';

const LatestPosts = ({ posts }: { posts: PostType[] }) => {
    return (
        <div className='w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-neutral-900 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
                <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white'>Latest Posts</h5>
            </div>
            <div className='flow-root'>
                <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {posts?.map((post) => (
                        <li className='py-3 sm:py-4' key={post.postNum}>
                            <div className='flex items-center'>
                                <div className='flex-shrink-0'>
                                    {post?.imageUrl && <Image src={post?.imageUrl} alt={post.title || ''} width={32} height={32} />}
                                </div>
                                <div className='flex-1 min-w-0 ms-4'>
                                    <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
                                        {post?.title}
                                    </p>
                                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                                        {post?.content}
                                    </p>
                                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                                        {new Date(post?.date).toUTCString()}
                                    </p>
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