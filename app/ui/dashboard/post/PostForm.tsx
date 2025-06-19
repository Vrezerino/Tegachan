'use client'

import { PostType } from '@/app/lib/definitions';
import { FormEvent, useState, useRef, Dispatch, SetStateAction } from 'react';

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  removeGapsFromString
} from '@/app/lib/utils';

import { useRouter } from 'nextjs-toploader/app';
import { usePathname } from 'next/navigation';

import toast from 'react-hot-toast';
import PostingAnim from '../postingAnim';
import { useRecipients } from './useRecipients';

interface PostFormProps {
  op: PostType | null;
  recipients: number[];
  setRecipients?: Dispatch<SetStateAction<number[]>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const PostForm = ({
  op,
  recipients,
  setRecipients,
  content,
  setContent
}: PostFormProps) => {
  const [image, setImage] = useState<Blob | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check file type and size
  const setImageFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('GIF/JPG/PNG/WEBP/AVIF only.');
      if (fileRef.current) fileRef.current.value = '';
    }

    if (file?.size >= MAX_FILE_SIZE) {
      toast.error(`Image must be under ${MAX_FILE_SIZE / 1000000} MB in size.`);
      if (fileRef.current) fileRef.current.value = '';
    }

    setImage(file);
  }

  useRecipients({
    content,
    opPostNum: op?.post_num,
    setRecipients
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const board = pathname.split('/')[1];

    /**
     * Set true so loading anim is rendered. While true,
     * form post button and text area are disabled
    */
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    /**
     * Set post content and image from state and don't get them directly
     * from form data. Content will be stripped of multiple linebreaks and spaces
    */
    const noGapContent = removeGapsFromString(content);
    formData.set('content', String(noGapContent));
    if (image) formData.set('image', image);


    /**
     * If postForm gets existing OP as prop, the new post will be a reply.
     * Otherwise it is itself OP
    */
    if (op) {
      formData.set('OP', 'false');
      formData.set('thread', op.post_num.toString());
    } else {
      formData.set('OP', 'true');
    }

    formData.set('board', board);
    formData.set('recipients', JSON.stringify(recipients));

    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: formData,
    });

    response && setLoading(false);

    // Clear state, reset recipient array, clear textarea on successful post
    if (response.status === 201) {
      setContent('');
      setImage(null);
      op && setRecipients && setRecipients([op.post_num]);
      if (fileRef.current) fileRef.current.value = '';

      /**
       * Refresh thread if you have op in props i.e. you're not the op,
       * otherwise redirect to thread num
      */
      if (op) {
        router.refresh();
      } else {
        const thread_num = (await response.json()).post_num;
        router.push(`/${board}/${thread_num}`);
      }
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

          {!op &&
            <input type='text'
              name='title'
              placeholder='Title (optional)'
              maxLength={80}
              className='peer block mb-1 w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
              data-testid='postform-title'
            />}

          <input type='text'
            name='name'
            placeholder='Name (optional)'
            maxLength={30}
            className='peer block mb-1 w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
            data-testid='postform-name'
          />

          <div className='relative rounded-md'>
            <div className='relative'>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1500}
                placeholder='Max 1500 characters'
                className='h-32 peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 text-neutral-900 dark:text-neutral-300'
                // Text not required if uploading image, unless you're OP (see below for post button)
                required={!image}
                disabled={loading}
                data-testid='postform-textarea'
              />
              {loading && <PostingAnim />}
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
                  ref={fileRef}
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  type='file'
                  step='0.01'
                  placeholder='Image (optional)'
                  className='fileInput peer block w-full rounded-md border border-neutral-200/30 bg-neutral-200 dark:bg-neutral-900 p-2 text-sm outline-1 placeholder:text-neutral-500 dark:fileInput-darkmode'
                  data-testid='postform-file-button'
                />
              </div>
            </div>
          </div>
          <button
            id='postBtn'
            className='rounded-md p-3 border border-orange-200/70 dark:border-neutral-500/70 bg-sky-100/40 dark:bg-neutral-700 text-sm font-medium dark:text-neutral-300 hover:bg-blue-200/60 md:flex-none md:justify-start md:p-2 md:px-3'
            type='submit'
            // OP post must always have text content; Reply must have either image, text or both
            disabled={(!op && !content) || (op && (!image && content.length == 0)) || content.length >= 1500 || loading}
            data-testid='postform-postbutton'
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
};

/**
const PostFormSmall = ({ replyTo }: { replyTo: PostType }) => {
  return (
    <form>
    </form>
  );
};
*/

export default PostForm;