import { MAX_FILE_SIZE } from '@/app/lib/utils';

const Page = () => {
  return (
    <main
      className='mt-0 mb-16 mx-auto w-full max-w-md p-2 bg-white border border-gray-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 text-gray-900 dark:text-white dark:bg-neutral-900 dark:border-gray-700'
      aria-label='site information and rules'
    >
      <header>
        <h1 className='sr-only'>
          Tegachan rules and information
        </h1>
      </header>

      <section aria-labelledby='rules'>
        <header>
          <h2
            id='rules'
            className='text-center text-xl font-bold leading-none text-gray-900 dark:text-white mb-6 dark:header-darkmode'
          >
            Rules
          </h2>
        </header>

        <p className='py-4 text-md font-bold text-red-600'>
          1. Be respectful
        </p>
        <p className='ml-4 text-sm font-medium'>
          Arguments and criticism is allowed, insulting other posters may get you banned.
        </p>

        <p className='py-4 text-md font-bold text-red-600'>
          2. Do not incite
        </p>
        <p className='ml-4 text-sm font-medium'>
          Incitation of violence is not allowed. Misinformation and disinformation is allowed up to a certain point,
          the threshold being that it does not incite or cause harm.
        </p>

        <p className='py-4 text-md font-bold text-red-600'>
          3. Do not post harmful links
        </p>
        <p className='ml-4 text-sm font-medium'>
          Posting links for monetary gain through scams, or links that contain malware, is a bannable offense.
        </p>

        <p className='py-4 text-md font-bold text-red-600'>
          4. Do not post illegal content or links
        </p>
        <p className='ml-4 text-sm font-medium'>
          This site uses services from countries in which distribution of material of e.g. certain types of abuse is illegal.
          If you submit this type of content, your IP address will get forwarded to authorities and/or at the very least,
          you will get banned permanently.
        </p>

        <p className='py-4 text-md font-bold text-red-600'>
          5. Do not post extremely graphic images
        </p>
        <p className='ml-4 text-sm font-medium'>
          Posting the following kinds of content is discouraged or might result in a ban:
          gore, hardcore pornographic images/videos and links to such content.
        </p>

        <p className='text-sm font-medium mt-7'>
          These sitewide rules exist to ensure an enjoyable experience and this site encourages submitting
          constructive, fun and interesting posts. Site rules and information are subject to change.
        </p>
      </section>

      <section aria-labelledby='site-information-heading'>
        <header>
          <h2
            id='site-information-heading'
            className='text-center text-xl font-bold leading-none mt-12 mb-6 dark:header-darkmode'
          >
            Site Information
          </h2>
        </header>

        <p className='py-4 text-md font-bold'>
          How to post
        </p>
        <p className='ml-4 text-sm font-medium mb-5'>
          You can submit a new thread on a board &#40;for example on <b>Music</b>&#41; and/or reply to others by clicking either the
          date or the post count number &#40;preceded by &ldquo;№&rdquo;&#41; on top of each post.
        </p>
        <p className='ml-4 my-4 text-sm font-medium'>
          There is a 30 second timeout after posting from the same IP, to prevent flooding.
          Maximum image file size is {MAX_FILE_SIZE / 1000000} MB and supported formats are JPG PNG GIF AVIF WEBP.
          All timestamps are Greenwich Mean Time (GMT, UTC+0).
        </p>

        <p className='ml-4 my-4 text-sm font-medium'>
          In post content, &#62; starts a quote line/makes the line <span className='text-green-600'>green</span>.<br />
          &#62;r&#62; makes <span className='text-red-600'>red text</span>.<br />
          &#62;bl&#62; makes <span className='text-blue-600'>blue text</span>.<br />
          &#62;y&#62; makes <span className='text-yellow-500'>yellow text</span>.<br />
          &#62;p&#62; makes <span className='text-pink-500'>pink text</span>.<br />
          &#62;#FF8400&#62; makes <span className='text-[#FF8400]'>orange text</span>. Any hex color code can be used.<br />
          &#62;b&#62; <b>bolds</b> the text.<br />
          &#62;i&#62; makes the text <i>italic</i>.<br />
          &#62;w&#62; makes text wEiRd.
        </p>

        <p className='ml-4 my-4 text-sm font-medium'>
          These modifiers can be combined and many can be used within the same line. &#62;bl,b,i&#62;this is blue, bold and italic will look like
          <span className='text-blue-600 font-bold italic'> this is blue, bold and italic</span>. &#62;r,w&#62;abcd&#62;#5CA8BF&#62;efgh will
          look like <span className='text-red-600'>AbCd</span><span className='text-[#5CA8BF]'>efgh</span>.
        </p>

        <p className='ml-4 mt-4 text-sm font-medium'>
          YouTube URLs can be pasted in the post content for video embedding. The embed is revealed by a &#91;▼&#93; button next to the URL.
        </p>

        <p className='py-6 text-md font-bold'>
          How to contact an admin
        </p>
        <p className='ml-4 text-sm font-medium'>
          As of now you can invoke an administrator simply by stating in a post that you wish to
          communicate with them. You will then get a reply as soon as possible.
        </p>

        <p className='py-6 text-md font-bold'>
          About Tegachan
        </p>
        <p className='ml-4 text-sm font-medium'>
          Tegachan was launched on 8th April 2024. It was not created using any imageboard templates.
        </p>

      </section>

      <section aria-labelledby='support-heading-small'>
        <header>
          <p id='support-heading-small' className='py-6 text-md font-bold'>
            Support me!
          </p>
        </header>

        <p className='ml-4 text-sm font-medium mb-5 break-all'>
          <b>BTC</b>: 12z26XmZ8NDQnyorikAGTAwUGyqfR1qVyq<br />
          <b>ETH</b>: 0xAA217342517acf1B0bedc2e2080dC3DA2f4e89fE<br />
          <b>XMR</b>: 45HDz4NUeStNLCKCREoKDZCo4KqcysmcLNLe41av4raGLQCniYtEjokDuVm2EuWm7hejaqFME7nXBM367xLtZHSNEUtCp7R<br />
          <b>DOGE</b>: DTmLNC4efVjQiJ64dcYrSbSS7UEtKqhUJV<br />
          <b>XRP</b>: r4vzNgvFzddbM1aR2Q3ea4VMRYQca3kPAy
        </p>
      </section>
    </main>
  );
};

export default Page;