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
                {post.imageUrl && (
                    <div key={post.postNum} className='min-w-40 relative'>
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
                )}
                <div className='flex flex-col justify-between p-3 leading-normal'>
                    <span className='text-xs text-red-400 dark:text-red-200/30 inline-block'>{parseDate(post.date)} <b>№ {post.postNum}</b></span>
                    <h1 className='text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>
                    <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{post.content}</p>

                    {post.replies?.length > 0 && post.replies.map((reply) => (
                        <span key={reply.postNum} className='text-xs text-gray-700 dark:text-gray-400'>{reply.postNum}</span>
                    ))}
                </div>
            </div>

            {/* Possible replies */}
            {post.replies.length > 0 && post.replies.map((reply) => (
                <div className='post dark:post-darkmode flex bg-white border border-neutral-200 rounded-lg shadow sm:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
                    {reply.imageUrl && (
                        <div key={reply.postNum} className='min-w-40 relative'>
                            <Link href={reply.imageUrl} target='_blank'>
                                <Image
                                    src={reply.imageUrl}
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
                    )}
                    <div className='flex flex-col justify-between p-3 leading-normal'>
                        <span className='text-xs text-red-400 dark:text-red-200/30 inline-block'>{parseDate(reply.date)} <b>№ {reply.postNum}</b></span>
                        <p className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{reply.content}</p>
                        {reply.replies?.length > 0 && reply.replies.map((rr) => (
                            <span key={rr.postNum} className='font-normal text-gray-700 dark:text-gray-400 mt-5'>{rr.postNum}</span>
                        ))}
                    </div>
                </div>
            ))}

            {/* Reply form */}
            <ReplyFormBig op={post} />
        </>
    )
}

export default Post;