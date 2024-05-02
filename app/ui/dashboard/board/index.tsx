import { PostType } from '@/app/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import { PostFormBig } from '../post/postForm';

const BoardItem = ({ post }: { post: PostType }) => {
    return (
        <Link href={`/dashboard/${post.board}/${post.postNum}`}>
            <div className='posts-container-post m-1 border-gray-200 shadow dark:border-neutral-800 dark:posts-container-post-darkmode'>
                {post.imageUrl && <div className='posts-container-post-image'>
                    <Image
                        className='w-full'
                        src={post.imageUrl}
                        width={160}
                        height={160}
                        alt={post.title || 'Post image'}
                    />
                </div>}

                <div className='posts-container-text p-3'>
                    <h5 className='posts-container-post-title line-clamp-2 dark:posts-container-post-title-darkmode'>{post?.title}</h5>
                    <p className='line-clamp-4 font-normal text-neutral-600 dark:text-neutral-300'>{post?.content}</p>
                </div>
            </div>
        </Link>
    );
};

const Board = ({ posts }: { posts: PostType[] }) => {
    return (
        <div>
            <div className='posts-container'>
                {posts?.map((post: PostType) => (
                    <BoardItem post={post} key={post.postNum} />
                ))}
            </div>
            <div>
                <PostFormBig recipients={[]} setRecipients={null} op={null} />
            </div>
        </div>
    );
};

export default Board;