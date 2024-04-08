import { PostType } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { ReplyFormBig, ReplyFormSmall } from './replyForms';
import Image from 'next/image';
import Link from 'next/link';

const Post = ({ post }: { post: PostType }) => {
    return (
        <>
            {/* Thread starter (OP) */}
            <div className='post dark:post-darkmode flex bg-white border border-neutral-200 rounded-lg shadow sm:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
                <div className='min-w-40 relative'>
                    <Link href={post.imageUrl} target='_blank'>
                        <Image
                            src={post.imageUrl}
                            alt='Post image'
                            fill
                            style={{
                                objectFit: 'contain',
                                objectPosition: 'left top'
                            }}
                            placeholder='blur'
                            blurDataURL='/img/misc/blurred.jpg'
                            className='object-cover rounded-tl-lg' />
                    </Link>
                </div>
                <div className='flex flex-col justify-between p-4 leading-normal'>
                    <span className='text-xs text-red-400 dark:text-red-200/30'>{parseDate(post.date)}</span>
                    <h1 className='text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>
                    <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{post.content}</p>
                </div>
            </div>

            {/* Possible replies */}
            {post.replies.length > 0 && post.replies.map((reply) => (
                <div key={reply.postNum}>
                    <div className='post dark:post-darkmode flex flex-col bg-white border border-neutral-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
                        {reply.imageUrl && <Image src={reply.imageUrl} alt='Reply image' className='object-cover w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg' width={500} height={700} />}
                        <div className='flex flex-col justify-between p-4 leading-normal'>
                            <span className='text-xs text-red-400 dark:text-red-200/30'>{parseDate(reply.date)}</span>
                            <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{reply.content}</p>
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