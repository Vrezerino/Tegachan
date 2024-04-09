import { PostType } from '../lib/definitions';
import { getLatestPosts } from '../api/posts/route';
import LatestPosts from '../ui/dashboard/latestPosts';

const Page = async () => {
    const data: PostType[] = await getLatestPosts();
    
    return(
        <main>
            <div>
                <h1 className='text-4xl font-bold mb-3 dark:h1-darkmode'>Welcome to Tegachan!</h1>
            </div>
            <LatestPosts posts={data}/>
        </main>
    )
}

export default Page;