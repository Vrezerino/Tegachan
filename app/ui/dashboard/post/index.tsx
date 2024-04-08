import { PostType } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { ReplyFormBig, ReplyFormSmall } from './replyForms';

const Post = ({ post }: { post: PostType }) => {
    return (
        <>
            {/* Thread starter (OP) */}
            <div className='post dark:post-darkmode flex flex-col bg-white border border-neutral-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
                <img src={post.imageUrl} alt='' className='object-cover w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg' />
                <div className='flex flex-col justify-between p-4 leading-normal'>
                    <span className='text-xs text-red-400 dark:text-red-200/30'>{parseDate(post.date)}</span>
                    <h1 className='text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>
                    <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{post.content}</p>
                </div>
            </div>

            {/* Possible replies */}
            {post.replies.length > 0 && post.replies.map((r) => (
                <div>
                    <div className='post dark:post-darkmode flex flex-col bg-white border border-neutral-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
                        {post.imageUrl && <img src={post.imageUrl} alt='' className='object-cover w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg' />}
                        <div className='flex flex-col justify-between p-4 leading-normal'>
                            <span className='text-xs text-red-400 dark:text-red-200/30'>{parseDate(post.date)}</span>
                            <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{post.content}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Reply form */}
            <ReplyFormBig replyTo={post} />
        </>
    )
}

export default Post;