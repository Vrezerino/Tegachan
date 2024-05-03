'use client'

import { PostType } from '@/app/lib/definitions';
import { FormEvent, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingAnim from '../loadingAnim';
import { sanitizeString } from '@/app/lib/utils';

interface PostFormProps {
    op: PostType | null;
    recipients: number[];
    setRecipients: Dispatch<SetStateAction<number[]>> | null;
}

const PostFormBig = ({
    op,
    recipients,
    setRecipients
}: PostFormProps) => {
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<Blob | null>();
    const [loading, setLoading] = useState<boolean>();

    const fileRef = useRef<HTMLInputElement>(null);

    const pathname = usePathname();
    const router = useRouter();

    const removeRecipient = (postNumber: number) => {
        op?.postNum
            !== postNumber
            && recipients
            && setRecipients
            && setRecipients(recipients.filter((r) => r !== postNumber));
    }

    useEffect(() => {
        // If you're replying to an OP, set first recipient as OP
        op && setRecipients && setRecipients([op.postNum]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set true so loading anim is rendered
        // While true, form post button is disabled
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Set post content and image from state and don't get them directly from form data
        // Content will be stripped of multiple linebreaks and spaces
        formData.set('content', sanitizeString(content));
        if (image) formData.set('image', image);

        // Arrays must be stringified in FormData objects — parse it on server
        formData.set('replyTo', JSON.stringify(recipients));

        // Get the name of the board you're posting on and set it to formData
        formData.set('board', pathname.split('/')[2]);

        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: formData,
        });

        response && setLoading(false);

        if (response.status === 201) {
            // Clear state, reset recipient array, clear textarea on successful post
            setContent('');
            setImage(null);
            op && setRecipients && setRecipients([op.postNum]);
            if (fileRef.current) fileRef.current.value = '';
            
            router.refresh();
        } else {
            toast.error((await response.json()).message);
        }
    }
    return (
        <>
            {loading && <LoadingAnim />}
            <form onSubmit={onSubmit} id='postForm' className={`postForm bg-sky-200/30 mt-10 p-3 border border-neutral-200 rounded-lg shadow w-full md:max-w-xl dark:border-neutral-800 dark:postForm-darkmode dark:bg-neutral-900`}>
                <div>
                    {/* Text content */}
                    <label htmlFor='postlabel' className='mb-2 block text-sm font-medium dark:label-darkmode'>
                        {op ? 'Reply' : 'Post new thread'}
                    </label>
                    <div className='relative rounded-md'>
                        <div className='relative'>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='Max 1500 characters'
                                className='h-32 peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
                                required
                            />
                        </div>
                    </div>

                    {/* Recipients */}
                    {op && <div className='flex flex-wrap gap-x-1'>
                        <label className='mt-2 mb-2 block text-sm font-medium dark:label-darkmode'>
                            Recipients:
                        </label>
                        {recipients.map(
                            (r) => <span onClick={() => removeRecipient(r)} className={`${r !== op?.postNum && 'hover:cursor-pointer hover:bg-blue-200/60 '} rounded-md p-1 mt-1 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 md:flex-none md:justify-start md:p-1 md:px-2`} key={r}>{r === op?.postNum ? 'OP' : `${r} ❌`}</span>
                        )
                        }
                    </div>}

                    {/* Image */}
                    <div className='mb-4'>
                        <label htmlFor='image' className='mt-2 mb-2 block text-sm font-medium dark:label-darkmode'>
                            Image (optional)
                        </label>
                        <div className='relative rounded-md'>
                            <div className='relative'>
                                <input
                                    ref={fileRef}
                                    onChange={(e) => e.target.files && setImage(e.target.files[0])}
                                    type='file'
                                    step='0.01'
                                    placeholder='Image (optional)'
                                    className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 placeholder:text-neutral-500'
                                />
                            </div>
                        </div>
                    </div>
                    <button id='postBtn' className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3' type='submit' disabled={!content || content.length >= 1500 || loading}>Post</button>
                </div>
            </form>
        </>
    );
};

const PostFormSmall = ({ replyTo }: { replyTo: PostType }) => {
    return (
        <form>
        </form>
    );
};

export { PostFormBig, PostFormSmall };