'use client'

import { PostType } from '@/app/lib/definitions';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingAnim from '../loadingAnim';

const PostFormBig = ({ op }: { op: PostType | null }) => {
    const [recipients, setRecipients] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>();
    const [timer, setTimer] = useState(60);
    //const intervalRef = useRef<NodeJS.Timeout>();

    const pathname = usePathname();
    const router = useRouter();

    /*
    const triggerCounter = () => {
        const intervalId = setInterval(() => {
            setTimer((time) => {
                if (time === 0) {
                    clearInterval(timer);
                    return 0;
                } else return time - 1;
            });
        }, 1000);
        intervalRef.current = intervalId;
    }
    */

    useEffect(() => {
        // If you're replying to an OP, set first recipient as OP
        op && setRecipients([op.postNum]);
    }, [])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        //triggerCounter();

        const formData = new FormData(e.currentTarget);

        // Arrays must be stringified in FormData objects — parse it on server
        formData.set('replyTo', JSON.stringify(recipients));

        // Get the name of the board you're posting on and set it to formData
        formData.set('board', pathname.split('/')[2]);

        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: formData,
        });

        response && setLoading(false);

        if (response.status === 200) {
            router.refresh();
            document.getElementById('content')!.textContent = '';
        } else {
            toast.error((await response.json()).message);
        }
    }
    return (
        <>
            {loading && <LoadingAnim />}
            <form onSubmit={onSubmit} className={`postForm bg-sky-200/30 mt-10 p-3 border border-neutral-200 rounded-lg shadow ${!op && 'w-full'} md:max-w-xl dark:border-neutral-800 dark:postForm-darkmode dark:bg-neutral-900`}>
                <div>
                    {/* Text content */}
                    <label htmlFor='postlabel' className='mb-2 block text-sm font-medium dark:label-darkmode'>
                        {op ? 'Reply to OP' : 'Post new thread'}
                    </label>
                    <div className='relative rounded-md'>
                        <div className='relative'>
                            <textarea
                                id='content'
                                name='content'
                                placeholder='Max 1500 characters'
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
                    <button id='postBtn' className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3' type='submit'>{timer === 60 ? 'Post' : timer}</button>
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