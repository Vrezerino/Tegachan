import { getMongoDb as db } from '@/app/lib/mongodb';
import { FindOptions } from 'mongodb';

export const getPost = async (board: string, pn: string) => {
    const postNum = parseInt(pn);
    const post = await (await db()).collection('posts').findOne({ board, postNum });

    // Recursive function to fetch replies for a given post number
    const fetchReplies = async (postNum: number) => {
        // Find the post with the given postNum and get its replies
        const postWithReplies = await (await db())
            .collection('posts')
            .findOne({ postNum: postNum }, { projection: { replies: 1 } });

        // Exclude IP field
        const projection: FindOptions = { projection: { IP: 0 } };
        if (postWithReplies && postWithReplies.replies && postWithReplies.replies.length > 0) {
            // Fetch all posts whose postNum is in the replies array
            const repliesArray = await (await db())
                .collection('posts')
                .find({ postNum: { $in: postWithReplies.replies } }, projection) // Use the projection to limit fields
                .toArray();


            // Iterate through replies and fetch their own replies recursively
            for (const reply of repliesArray) {
                reply.replies = await fetchReplies(reply.postNum);
            }

            return repliesArray;
        }
    }

    const replies = await fetchReplies(postNum);

    // Only add the replies member to object if the replies array isn't empty
    return JSON.parse(JSON.stringify({ ...post, ...(replies && { replies }) }));
};