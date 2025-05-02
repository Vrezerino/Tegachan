'use client'

import { PostType } from '@/app/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import { PostFormBig } from '../post/postForm';
import { useState } from 'react';

const BoardItem = ({ post }: { post: PostType }) => {
  return (
    <Link href={`/dashboard/${post.board}/${post.post_num}`}>
      <div className='posts-container-post m-1 border-gray-200 shadow-sm dark:border-neutral-800 dark:posts-container-post-darkmode'>
        {post.image_url && <div className='posts-container-post-image'>
          <Image
            className='w-full'
            src={post.image_url}
            width={160}
            height={160}
            alt={post.title || 'Post image'}
          />
        </div>}

        <div className='posts-container-text p-3'>
          <h5 className='posts-container-post-title line-clamp-2 dark:posts-container-post-title-darkmode' data-testid='boardtype-post-title'>{post?.title}</h5>
          <p className='line-clamp-4 font-normal text-neutral-600 dark:text-neutral-300' data-testid='boardtype-post-content'>{post?.content}</p>
        </div>
      </div>
    </Link>
  );
};

const NewThreadForm = () => {
  const [recipients, setRecipients] = useState<number[]>([]);
  const [content, setContent] = useState<string>('');

  return (
    <PostFormBig
      content={content}
      setContent={setContent}
      recipients={recipients}
      setRecipients={setRecipients}
      op={null}
    />
  );
};

const Board = ({ posts }: { posts: PostType[] }) => {
  return (
    <div>
      <div className='posts-container'>
        {posts?.map((post: PostType) => (
          <BoardItem post={post} key={post.post_num} />
        ))}
      </div>
      <div>
        <NewThreadForm />
      </div>
    </div>
  );
};

export default Board;