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
   * If post has any quotes/mentions, render them as links
   * @param content string
   * @returns (string | JSX.Element)[]
   */
  const renderContentWithLinks = (content: string) => {
    const regex = />>(\d{1,10})(\s*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Iterate over all matches
    while ((match = regex.exec(content)) !== null) {
      // Push the text before the match
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // Push the link for the match
      const post_num = match[1];
      parts.push(
        <a href={`#${post_num}`} key={`link-${post_num}`} className='font-bold underline'>
          {`>>${post_num}`}
        </a>
      );

      // Update the last index to the end of the match
      lastIndex = regex.lastIndex;
    }

    // Push the remaining text after the last match
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div key={`post-${post.post_num}`} id={post.post_num?.toString()} className='post dark:post-darkmode flex bg-white border border-neutral-200 rounded-xs shadow-sm sm:flex-row md:max-w-xl dark:border-neutral-800 dark:bg-neutral-900'>
      {post.image_url && (
        <div key={`imgContainer-${post.post_num}`} className='min-w-40 relative'>
          <Link key={post.post_num} href={post.image_url} target='_blank'>
            <Image
              src={post.image_url}
              key={`image-${post.post_num}`}
              alt='Post image'
              fill
              style={{
                objectFit: 'contain',
                objectPosition: 'left top'
              }}
              placeholder='blur'
              blurDataURL='/img/misc/blurred.jpg'
              className='object-cover rounded-tl-sm' />
          </Link>
        </div>
      )}
      <div key={`textContent-${post.post_num}`} className='flex flex-col justify-between p-3 leading-normal'>
        <a onClick={() => addRecipient(post.post_num)} href={`#postForm`} className='text-xs text-red-400 dark:text-red-200/30 inline-block'>
          {parseDate(post.created_at)} <b>№ <span className='underline hover:cursor-pointer'>{post.post_num}</span></b> {post.admin && <span className='text-red-700 font-bold'>ADMIN</span>}
        </a>

        {/* Clickable reply post_numbers except on OP */}
        {!post.is_op && replies?.length > 0 && (
          <div className='flex flex-wrap gap-x-1'>
            {replies.map((r) => (
              <a href={`#${r}`} key={`replypost_num-${r}`} className='font-normal text-xs text-gray-700 dark:text-gray-400 underline'>&gt;&gt;{r}</a>
            ))}
          </div>
        )}

        {post.is_op && <h1 className='text-3xl font-bold dark:h1-darkmode'>{post.title}</h1>}
        <p className='whitespace-pre-wrap font-normal text-gray-700 dark:text-gray-400 mt-5'>
          {renderContentWithLinks(post.content)}
        </p>
      </div>
    </div>
  )
}

export default Post;