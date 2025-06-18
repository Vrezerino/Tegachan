'use client'

import { PostType } from '@/app/lib/definitions';
import { getFlagEmoji, parseDate } from '@/app/lib/utils';
import PostForm from './PostForm';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import FormatContent from '@/app/ui/components/utils/formatContent';
import Link from 'next/link';

const Post = ({ posts }: { posts: PostType[] }) => {
  const [recipients, setRecipients] = useState<number[]>([]);
  const [content, setContent] = useState<string>('');
  return (
    <section aria-label='discussion thread'>
      {/* Thread starter (OP) and possible replies */}
      {posts.map((post) => {
        // Each post will have a replies number array (and already has an array of replied-to posts)
        const replies = posts.filter(p => p.parent_post_nums?.includes(post.post_num))
          .map(r => r.post_num);

        return (<PostContent
          key={post.post_num}
          recipients={recipients}
          setRecipients={setRecipients}
          content={content}
          setContent={setContent}
          post={post}
          replies={replies} />)
      })}

      <a href='#top'>
        <p className='text-xs wrap-anywhere text-center mt-8 font-normal text-neutral-600/60 dark:text-neutral-300/60' data-testid='back-to-board-link'>↑ Back to top</p>
      </a>

      {/* Reply form */}
      <PostForm
        recipients={recipients}
        setRecipients={setRecipients}
        op={posts[0]}
        content={content}
        setContent={setContent} />
    </section>
  );
};

interface PostContentProps {
  post: PostType;
  replies: number[];
  recipients: number[];
  setRecipients: Dispatch<SetStateAction<number[]>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const PostContent = ({
  post,
  replies,
  recipients,
  setRecipients,
  content,
  setContent
}: PostContentProps
) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ widthOpened: number; heightOpened: number; widthThumbnail: number, heightThumbnail: number } | null>(null)
  const imgRef = useRef<HTMLImageElement>(null);

  // Opened image's width capped at 800px because of post container width
  // Container height can stretch more
  /**
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.naturalWidth && img.naturalHeight) {

      setDimensions({
        widthOpened: 1,
        heightOpened: 1,
        widthThumbnail: img.naturalWidth > 110 ? (img.naturalWidth / img.naturalHeight) * 110 : img.naturalWidth,
        heightThumbnail: 110
      });

      if (img.naturalWidth > 800) {
        const height = (img.naturalHeight / img.naturalWidth) * 800;
        setDimensions(prev => prev && {
          ...prev,
          widthOpened: 800,
          heightOpened: Math.round(height)
        });
      } else {
        setDimensions(prev => prev && {
          ...prev,
          widthOpened: img.naturalWidth,
          heightOpened: img.naturalHeight
        });
      }
    }
  }, [post.image_url])
  */

  // Called when you click on a post's post_number in order to reply to it.
  const addRecipient = (replyNum: number) => {
    if (recipients.length <= 5) {
      if (!recipients.includes(replyNum)) {
        setRecipients([...recipients, replyNum]);
        setContent(prev => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}>>${replyNum}\n`);
      }
    } else {
      toast.error('Can only reply to max 5 posts.');
    }
  }

  return (
    /**
     * <div key={`post-${post.post_num}`} id={post.post_num?.toString()} data-testid='post-container' className={`table clear-both post mb-1 dark:post-darkmode ${post.admin ? 'bg-orange-700/30' : 'bg-white'} border border-neutral-200 rounded-xs shadow-sm sm:flex-row md:max-w-[800px] w-full dark:border-neutral-800 ${post.admin ? 'dark:bg-orange-950' : 'dark:bg-neutral-900'}`}>
     */
    <article
      key={`post-${post.post_num}`}
      id={post.post_num?.toString()}
      className={`table clear-both post mb-1 dark:post-darkmode ${post.admin ? 'bg-orange-700/30' : 'bg-white'} border border-neutral-200 rounded-xs shadow-sm sm:flex-row md:max-w-[800px] w-full dark:border-neutral-800 ${post.admin ? 'dark:bg-orange-950' : 'dark:bg-neutral-900'}`}
      aria-label={`post number ${post.post_num} posted by ${post.name}`}
      data-testid='post-container'
    >
      {post.image_url && (
        /**
         * <div key={`imgContainer-${post.post_num}`} className={`relative float-left mr-4 ${opened ? `max-w-[800px] h-[${dimensions?.heightOpened}]` : `w-[110px] h-[110px]`}`}>
        */
        <figure key={`imgContainer-${post.post_num}`} className='relative float-left mr-4 max-w-[100px]'>
          <Link key={post.post_num} href={post.image_url} target='_blank'>
            <Image
              src={post.image_url}
              key={`image-${post.post_num}`}
              alt={`Post num ${post.post_num}'s image`}
              // className will determine final size so these are practically compression levels, higher is better
              width={110}
              height={110}
              style={{
                objectFit: 'cover',
                objectPosition: 'left top'
              }}
              placeholder='blur'
              blurDataURL='/img/misc/blurred.jpg'
              className='object-cover rounded-tl-sm max-h-[300px] w-[100px]'
              unoptimized={post.image_url.includes('.gif')}
              aria-label='post image'
              data-testid='post-image'
            />
            <figcaption className='sr-only'>Image submitted with post {post.post_num}</figcaption>
          </Link>
          {/**<Image
            src={post.image_url}
            key={`image-${post.post_num}`}
            alt={`Post num ${post.post_num}'s image`}
            width={opened ? dimensions?.widthOpened ?? 800 : dimensions?.widthThumbnail ?? 0}
            height={opened ? dimensions?.heightOpened ?? 800 : 110}
            style={{
              //objectFit: 'scale-down',
              objectPosition: 'left top',
              cursor: 'pointer'
            }}
            placeholder='blur'
            blurDataURL='/img/misc/blurred.jpg'
            /**
            className={`
              object-cover
              rounded-tl-sm
              ${opened ? `max-w-[800px]` : 'w-[100px] max-h-[300px]'}
            `}
            unoptimized
            data-testid='post-image'
            onClick={() => setOpened(prev => !prev)}
            ref={imgRef}

          />*/}

        </figure>
      )}

      <div className='pl-4 py-[9px]'>
        <a
          onClick={() => addRecipient(post.post_num)}
          href={`#postForm`}
          className={`wrap-anywhere text-xs text-red-400 dark:text-neutral-500 bg-transparent`}
          data-testid='post-info'
        >
          <header>
            <span data-testid='poster-name' aria-label='poster name'><b>{post.name ?? 'Noob'}</b></span>
            <span data-testid='poster-flag' aria-label='poster country flag'> {getFlagEmoji(post.country_code)} </span>
            <time dateTime={parseDate(post.created_at)} data-testid='post-created-at' aria-label='post date'> {parseDate(post.created_at)}</time>
            <b> № <span className='underline hover:cursor-pointer' data-testid='post_num' aria-label='post number'>{post.post_num}</span></b>
            {post.admin && <span className='text-red-700 font-bold' data-testid='poster-is-admin' aria-label='is post admin'> ADMIN</span>}
          </header>
        </a>

        {/* Clickable reply post_nums except on OP */}
        {!post.is_op && replies?.length > 0 && (
          <span className={`${!post.image_url && 'ml-4'} break-words dark:bg-transparent`} data-testid='reply-numbers' aria-label='post numbers of replies'>
            &nbsp;{replies.map((r) => (
              <span key={`replypost-num-span-${r}`}>
                <a
                  href={`#${r}`}
                  key={`replypost-num-link-${r}`}
                  className='font-normal text-xs text-gray-700/70 dark:text-gray-400/70 underline'>
                  &gt;&gt;{r}
                </a>
                &nbsp;
              </span>
            ))}
          </span>
        )}

        {post.title &&
          <>
            <br />
            <span
              className='span-h5 wrap-anywhere font-bold dark:header-darkmode'
              aria-label='post title'
              data-testid='post-title'
            >
              {post.title}
            </span>
          </>
        }
        <div
          className='text-sm font-medium wrap-anywhere text-gray-700 dark:text-gray-300 mb-1 pr-4'
          aria-label='post main text content'
          data-testid='post-content'>
          <br />
          {FormatContent({
            content: post.content,
            renderLinks: true,
            renderLinebreaks: true
          })}
        </div>
      </div>

    </article>
  )
}

export default Post;