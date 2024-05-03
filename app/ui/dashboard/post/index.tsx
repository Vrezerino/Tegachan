'use client'

import { PostType } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { PostFormBig } from './postForm';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';

const Post = ({ post }: { post: PostType }) => {
    const [recipients, setRecipients] = useState<number[]>([]);
    return (
        <>
            {/* Thread starter (OP) */}
            <PostContent
                recipients={recipients}
                setRecipients={setRecipients}
                post={post} />

            {/* Possible replies */}
            {post.replies?.length > 0 && post.replies.map((r) => (
                <PostContent
                    key={r.postNum}
                    recipients={recipients}
                    setRecipients={setRecipients}
                    post={r} />
            ))}

            {/* Reply form */}
            <PostFormBig
                recipients={recipients}
                setRecipients={setRecipients} op={post} />
        </>
    );
};

interface PostContentProps {
    post: PostType;
    recipients: number[];
    setRecipients: Dispatch<SetStateAction<number[]>>;
}

const PostContent = ({
    post,
    recipients,
    setRecipients
}: PostContentProps
) => {
    // Called when you click on a post's postnumber in order to reply to it.
    const addRecipient = (replyNum: number) => {
        if (recipients.length <= 5) {
            !recipients.includes(replyNum) && setRecipients([...recipients, replyNum]);
        } else {
            toast.error('Can only reply to max 5 posts.');
        }
    }
    return (
        <div key={`post-${post.postNum}`} id={post.postNum.toString()} className='post dark:post-darkmode flex bg-white border border-neutral-200 rounded-lg shadow sm:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
            {post.imageUrl && (
                <div key={`imgContainer-${post.postNum}`} className='min-w-40 relative'>
                    <Link key={post.postNum} href={post.imageUrl} target='_blank'>
                        <Image
                            src={post.imageUrl}
                            key={`image-${post.postNum}`}
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
            <div key={`textContent-${post.postNum}`} className='flex flex-col justify-between p-3 leading-normal'>
                <a onClick={() => addRecipient(post.postNum)} href={`#postForm`} className='text-xs text-red-400 dark:text-red-200/30 inline-block'>
                    {parseDate(post.date)} <b>№ <span className='underline hover:cursor-pointer'>{post.postNum}</span></b>
                </a>

                {/* Clickable reply postnumbers */}
                {post.replies?.length > 0 && (
                    <div className='flex flex-wrap gap-x-1'>
                        {post.replies.map((r) => (
                            <a href={`#${r.postNum}`} key={`replyPostNum-${r.postNum}`} className='font-normal text-xs text-gray-700 dark:text-gray-400 underline'>&gt;&gt;{r.postNum}</a>
                        ))}
                    </div>
                )}

                {/* Post content, possible links to replied-to posts */}
                {post.OP && <h1 className='text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>}
                <p className='whitespace-pre-wrap font-normal text-gray-700 dark:text-gray-400 mt-5'>
                    {post.replyTo?.map((pn, i) => i > 0 && <a className='font-bold underline' href={`#${pn}`} key={`replyToPostNum-${pn}`}>&gt;&gt;{pn}<br /></a>)}
                    {post.content}
                </p>
            </div>
        </div>
    )
}

export default Post;