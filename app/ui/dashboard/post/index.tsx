'use client'

import { PostType } from '@/app/lib/definitions';
import { parseDate } from '@/app/lib/utils';
import { PostFormBig } from './postForm';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';

const Post = ({ posts }: { posts: PostType[] }) => {
  const [recipients, setRecipients] = useState<number[]>([]);
  const [content, setContent] = useState<string>('');
  return (
    <>
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

      {/* Reply form */}
      <PostFormBig
        recipients={recipients}
        setRecipients={setRecipients}
        op={posts[0]}
        content={content}
        setContent={setContent} />
    </>
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

  /**
   * If post contains quotes/mentions, render them as links
   * @param content string
   * @returns (string | JSX.Element)[]
   */
  const renderContentWithLinks = (content: string) => {
    const regex = />>(\d{1,10})(\s*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const [post_num, trailingSpace] = match;

      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      parts.push(
        <a href={`#${post_num}`} key={`link-${post_num}`} className="font-bold underline">
          {`>>${post_num}`}
        </a>
      );

      // Preserve trailing space or newline after the link
      if (trailingSpace) {
        parts.push(trailingSpace);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div key={`post-${post.post_num}`} id={post.post_num?.toString()} data-testid='post-container' className='table clear-both post dark:post-darkmode bg-white border border-neutral-200 rounded-xs shadow-sm sm:flex-row md:max-w-[800px] w-full dark:border-neutral-800 dark:bg-neutral-900'>
      {post.image_url && (
        <div key={`imgContainer-${post.post_num}`} className='relative float-left mr-4'>
          <Link key={post.post_num} href={post.image_url} target='_blank'>
            <Image
              src={post.image_url}
              key={`image-${post.post_num}`}
              alt={`Post num ${post.post_num}'s image`}
              width={100}
              height={100}
              style={{
                objectFit: 'contain',
                objectPosition: 'left top'
              }}
              placeholder='blur'
              blurDataURL='/img/misc/blurred.jpg'
              className='h-min object-cover rounded-tl-sm'
              // endsWith() won't work due to Next image url format
              unoptimized={post.image_url.includes('.gif')}
              data-testid='post-image' />
          </Link>
        </div>
      )}
      
        <a onClick={() => addRecipient(post.post_num)} href={`#postForm`} className={`${!post.image_url && 'ml-4'} break-all mt-3 text-xs text-red-400 dark:text-red-200/30 inline-block bg-sky-600/5 dark:bg-transparent`} data-testid='post-timestamp-and-post_num'>
          {parseDate(post.created_at)} <b>№ <span className='underline hover:cursor-pointer'>{post.post_num}</span></b> {post.admin && <span className='text-red-700 font-bold'>ADMIN</span>}
        </a>

        {/* Clickable reply post_nums except on OP */}
        {!post.is_op && replies?.length > 0 && (
          <div className={`${!post.image_url && 'ml-4'} break-all flex flex-wrap gap-x-1 bg-sky-600/5 dark:bg-transparent w-full`}>
            {replies.map((r) => (
              <a href={`#${r}`} key={`replypost_num-${r}`} className='font-normal text-xs text-gray-700 dark:text-gray-400 underline'>&gt;&gt;{r}</a>
            ))}
          </div>
        )}

        {post.is_op && <h1 className='break-all ml-4 text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>}
        <p className='break-all font-normal text-gray-700 dark:text-gray-400 mt-3 pl-4 pr-4 pb-4' data-testid='post-content'>
          {renderContentWithLinks(post.content)}
        </p>
      
    </div>
  )
}

export default Post;