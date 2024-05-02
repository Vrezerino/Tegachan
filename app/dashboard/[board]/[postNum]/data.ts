import { getMongoDb as db } from '@/app/lib/mongodb';
import { FindOptions } from 'mongodb';

export const getPost = async (board: string, pn: string) => {
    const postNum = parseInt(pn);
    const post = await (await db()).collection('posts').findOne({ board, postNum });

    // Recursive function to fetch replies for a given post number
    const fetchReplies = async (postNum : number) => {
        // Exclude IP field
        const projection: FindOptions = { projection: { IP: 0 } };
        const data = await (await db())
            .collection('posts')
            .find({ replyTo: { $in: [postNum] } }, projection)
            .toArray();

        // Iterate through replies and fetch their own replies recursively
        for (const reply of data) {
            reply.replies = await fetchReplies(reply.postNum);
        }

        return data;
    }

    const replies = await fetchReplies(postNum);

    // Only add the replies member to object if the replies array isn't empty
    return JSON.parse(JSON.stringify({ ...post, ...(replies?.length > 0 && { replies }) }));
};