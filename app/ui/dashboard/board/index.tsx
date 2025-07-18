'use client'

import { CatalogOPType } from '@/app/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import PostForm from '../post/PostForm';
import { useState } from 'react';

const BoardItem = ({ post }: { post: CatalogOPType }) => {
  return (
    <Link href={`/${post.board}/${post.post_num}`}>
      <div className='posts-container-post m-1 border-gray-200 shadow-sm dark:border-neutral-800 dark:posts-container-post-darkmode'>
        {post.image_url ?
          <div className='posts-container-post-image'>
            <Image
              className='w-[160px] h-[73px]'
              src={post.image_url}
              width={160}
              height={73}
              style={{
                objectFit: 'cover',
                objectPosition: '40% 40%'
              }}
              unoptimized={post.image_url.includes('.gif')}
              alt={post.title || 'Post image'}
            />
          </div>
          : <div className='h-[73px]'></div>}

        <div className='posts-container-text p-3 flex flex-col h-[135px]'>
          <h5 className='posts-container-post-title wrap-anywhere line-clamp-2 dark:posts-container-post-title-darkmode' data-testid='boardtype-post-title'>{post?.title}</h5>
          <p className='wrap-anywhere line-clamp-4 font-normal text-neutral-600 dark:text-neutral-300' data-testid='boardtype-post-content'>{post?.content}</p>
          <p className='text-xs mt-auto font-normal text-neutral-600/60 dark:text-neutral-300/60 grow-0' data-testid='replycount'>{post.num_replies} {post.num_replies == 1 ? 'reply' : 'replies'}</p>
        </div>

      </div>
    </Link>
  );
};

const NewThreadForm = () => {
  const [recipients, setRecipients] = useState<number[]>([]);
  const [content, setContent] = useState<string>('');

  return (
    <PostForm
      content={content}
      setContent={setContent}
      recipients={recipients}
      setRecipients={setRecipients}
      op={null}
    />
  );
};

const Board = ({ posts, boardName }: { posts: CatalogOPType[], boardName: string }) => {
  return (
    <>
      <section className='posts-container' aria-labelledby='all-threads'>
        <h2 id='all-threads' className='sr-only'>All threads on {boardName}</h2>
        {posts?.map((post: CatalogOPType) => (
          <BoardItem post={post} key={post.post_num} />
        ))}
      </section>
      <section>
        <NewThreadForm />
      </section>
    </>
  );
};

export default Board;