'use client'

import { PostType } from '@/app/lib/definitions';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ReplyFormBig = ({ op }: { op: PostType }) => {
    const [recipients, setRecipients] = useState<number[]>([]);
    const router = useRouter();

    useEffect(() => {
        setRecipients([ op.postNum ]);
    }, [])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set('board', op.board);
        formData.set('replyTo', JSON.stringify(recipients));

        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: formData,
        });

        if (response.status >= 400) {
            toast.error((await response.json()).message);
        } else if (response.ok) {
            router.refresh();
        }
    }
    return (
        <form onSubmit={onSubmit} className='postForm mt-10 p-3 border border-neutral-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-neutral-800 dark:postForm-darkmode dark:bg-neutral-900'>
            <div>
                {/* Text content */}
                <div className='relative rounded-md'>
                    <div className='relative'>
                        <textarea
                            id='content'
                            name='content'
                            placeholder='Write reply (max 1500 characters)'
                            className='h-32 peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
                            required
                        />
                    </div>
                </div>

                {/* Image */}
                <div className='mb-4'>
                    <label htmlFor='image' className='mt-2 mb-2 block text-sm font-medium dark:label-darkmode'>
                        Image (optional)
                    </label>
                    <div className='relative rounded-md'>
                        <div className='relative'>
                            <input
                                id='image'
                                name='image'
                                type='file'
                                step='0.01'
                                placeholder='Image (optional)'
                                className='peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 placeholder:text-neutral-500'
                            />
                        </div>
                    </div>
                </div>
                <button className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3' type='submit'>Post</button>
            </div>
        </form>
    )
}

const ReplyFormSmall = ({ replyTo }: { replyTo: PostType }) => {
    return (
        <form>
        </form>
    )
}

export default ReplyFormBig;