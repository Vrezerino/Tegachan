import { getMongoDb as db } from '@/app/lib/mongodb';
import { FindOptions } from 'mongodb';

export const getPost = async (board: string, pn: string) => {
    const postNum = parseInt(pn);
    const post = await (await db()).collection('posts').findOne({ board, postNum });

    /**
     * Get replies that have the posts' postNum in their replyTo arrays,
     * exclude IP fields
     */
    const projection: FindOptions = { projection: { IP: 0 } };
    const replies = await (await db())
        .collection('posts')
        .find({ replyTo: { $in: [postNum] } }, projection)
        .toArray();

    // Only add the replies member to object if the replies array isn't empty
    return JSON.parse(JSON.stringify({ ...post, ...(replies?.length > 0 && { replies }) }));
};