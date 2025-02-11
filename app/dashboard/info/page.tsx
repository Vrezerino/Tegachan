const Page = () => {
  return (
    <div className='mt-0 mb-16 mx-auto w-full max-w-md p-2 bg-white border border-gray-200 rounded-sm rounded-br-2xl shadow sm:p-3 dark:bg-neutral-900 dark:border-gray-700'>
      <h1 className='text-center text-xl font-bold leading-none text-gray-900 dark:text-white mb-6 dark:h1-darkmode'>Rules</h1>

      <p className='py-4 text-md font-bold text-red-600'>
        1. Be respectful
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        Arguments and criticism is allowed, insulting other posters may get you banned.
      </p>

      <p className='py-4 text-md font-bold text-red-600'>
        2. Do not incite
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        Incitation of violence is not allowed. Misinformation and disinformation is allowed up to a certain point,
        the threshold being that it does not incite or cause harm.
      </p>

      <p className='py-4 text-md font-bold text-red-600'>
        3. Do not post harmful links
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        Posting links for monetary gain through scams, or links that contain malware, is a bannable offense.
      </p>

      <p className='py-4 text-md font-bold text-red-600'>
        4. Do not post illegal content or links
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        This site uses services from countries in which e.g. child pornography is illegal.
        If you submit this type of content, your IP address will get forwarded to authorities
        and/or at the very least, you will get banned permanently.
      </p>

      <p className='py-4 text-md font-bold text-red-600'>
        5. Do not post extremely graphic images
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        Posting the following kinds of content is discouraged or might result in a ban:
        gore, hardcore pornographic images/videos and links to such content.
      </p>

      <p className='text-sm font-medium text-gray-900 dark:text-white mt-7'>
        These sitewide rules exist to ensure an enjoyable experience and this site encourages submitting
        constructive, fun and interesting posts. Site rules and information are subject to change.
      </p>

      <h1 className='text-center text-xl font-bold leading-none text-gray-900 dark:text-white mt-16 mb-6 dark:h1-darkmode'>Site Information</h1>

      <p className='py-4 text-md font-bold text-gray-900 dark:text-white'>
        How to post
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white mb-5'>
        You can submit a new thread on a board &#40;for example on <b>Music</b>&#41; and/or reply to others by clicking either the
        date or the post count number &#40;preceded by &ldquo;№&rdquo;&#41; on top of each post.
      </p>
      {/*<p className='text-sm font-medium text-gray-900 dark:text-white my-5'>
                There is a 60 second timeout after posting to prevent flooding i.e. posting the same content multiple times in a short amount of time.
            </p>*/}
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        It is possible to reply to up to five other posters at a time, not counting the thread starter &#40;OP&#41;.
      </p>

      <p className='py-6 text-md font-bold text-gray-900 dark:text-white'>
        How to contact an admin
      </p>
      <p className='ml-4 text-sm font-medium text-gray-900 dark:text-white'>
        As of now you can invoke an administrator simply by stating in a post that you wish to
        communicate with them. You will then get a reply as soon as possible.
      </p>

    </div>
  );
};

export default Page;