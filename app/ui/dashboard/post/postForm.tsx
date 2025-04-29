'use client'

import { PostType } from '@/app/lib/definitions';
import { FormEvent, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  removeGapsFromString
} from '@/app/lib/utils';

import { useRouter } from 'nextjs-toploader/app';
import { usePathname } from 'next/navigation';

import toast from 'react-hot-toast';
import PostingAnim from '../postingAnim';

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
  const [loading, setLoading] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const removeRecipient = (post_number: number) => {
    op?.post_num
      !== post_number
      && recipients
      && setRecipients
      && setRecipients(recipients.filter((r) => r !== post_number));
  }

  // Check file size and type
  const setImageFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('File type not accepted, JPG/PNG/WEBP/AVIF only.');
      if (fileRef.current) fileRef.current.value = '';
    }

    if (file?.size >= MAX_FILE_SIZE) {
      toast.error('Image must be under 1MB in size.');
      if (fileRef.current) fileRef.current.value = '';
    }

    setImage(file);
  }

  useEffect(() => {
    // If you're replying to an OP, set first recipient as OP
    op && setRecipients && setRecipients([op.post_num]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set true so loading anim is rendered
    // While true, form post button and text area are disabled
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Set post content and image from state and don't get them directly from form data
    // Content will be stripped of multiple linebreaks and spaces
    const noGapContent = removeGapsFromString(content);
    formData.set('content', String(noGapContent));
    if (image) formData.set('image', image);

    // Arrays must be stringified in FormData objects — parse it on server
    formData.set('recipients', JSON.stringify(recipients));

    // If postForm gets existing OP as prop, the new post will be a reply. Otherwise it is itself OP
    if (op) {
      formData.set('OP', 'false');
      formData.set('thread', op.post_num.toString());
    } else {
      formData.set('OP', 'true');
    }

    // Get the name of the board you're posting on and set it to formData
    formData.set('board', pathname.split('/')[2]);

    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: formData,
    });

    response && setLoading(false);;

    if (response.status === 201) {
      // Clear state, reset recipient array, clear textarea on successful post
      setContent('');
      setImage(null);
      op && setRecipients && setRecipients([op.post_num]);
      if (fileRef.current) fileRef.current.value = '';

      router.refresh();
    } else {
      toast.error((await response.json()).message);
    }
  }
  return (
    <>

      <form onSubmit={onSubmit} id='postForm' className={`postForm bg-sky-200/30 mt-10 p-3 border border-neutral-200 rounded-xs shadow-sm w-full md:max-w-xl dark:border-neutral-800 dark:postForm-darkmode dark:bg-neutral-900`}>
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
                disabled={loading}
                data-testid='postFormTextArea'
              />
              {loading && <PostingAnim />}
            </div>

          </div>

          {/* Recipients */}
          {op && <div className='flex flex-wrap gap-x-1'>
            <label className='mt-2 mb-2 block text-sm font-medium dark:label-darkmode'>
              Recipients:
            </label>
            {recipients.map(
              (r) => <span onClick={() => removeRecipient(r)} className={`${r !== op?.post_num && 'hover:cursor-pointer hover:bg-blue-200/60 '} rounded-md p-1 mt-1 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 md:flex-none md:justify-start md:p-1 md:px-2`} key={r}>{r === op?.post_num ? 'OP' : `${r} ❌`}</span>
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
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  type='file'
                  step='0.01'
                  placeholder='Image (optional)'
                  className='fileInput peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 placeholder:text-neutral-500 dark:fileInput-darkmode'
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