import Image from 'next/image';

const PostingAnim = () => {
  return (
    <div className='absolute z-50 top-6 left-14'>
      <Image
        src='/img/postAnim.gif'
        width={229}
        height={58}
        alt='Posting animation'
        unoptimized={true}
      />
    </div>
  );
};

export default PostingAnim;