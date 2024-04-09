import { getMongoDb as db } from '@/app/lib/mongodb';

export const getPost = async (board: string, pn: string) => {
    const postNum = parseInt(pn);
    const post = await (await db()).collection('posts').findOne({ board, postNum });

    // Get replies that have the posts' postNum in their replyTo arrays
    const replies = await (await db()).collection('posts').find({ replyTo: { $in: [postNum] } }).toArray();

    return JSON.parse(JSON.stringify({ ...post, replies }));
}