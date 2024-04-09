import { getMongoDb as db } from '@/app/lib/mongodb';

export const getLatestPosts = async () => {
    // Get twenty latest posts from all boards
    const data = await (await db())
        .collection('posts')
        .find({})
        // Sort by date descending
        .sort({ date: -1 })
        .limit(20)
        .toArray();

    return JSON.parse(JSON.stringify(data));
}

export const getBumpedPosts = async (board: string) => {

    /**
     * Get thread starter (OP) posts from a certain board and sort either by
     * date or the date of the last reply to the post
     */
    const data = await (await db()).collection('posts').aggregate([
        // Stage 1: Filter by given board argument
        {
            $match: { board }
        },
        // Stage 2: Add fields to determine if the array is empty
        {
            $addFields: {
                isArrayEmpty: { $eq: [{ $size: '$replies' }, 0] },
                repliesCount: { $size: '$replies' }
            }
        },
        // Stage 3: Unwind the array to work with individual elements
        {
            $unwind: { path: '$replies', preserveNullAndEmptyArrays: true }
        },
        // Stage 4: Sort documents by the date field of the last added element or the document's date if the array is empty
        {
            $sort: {
                'replies.date': -1,
                'date': -1 // Sort by document's date if the array is empty
            }
        },
        // Stage 5: Drop fields we don't need
        {
            $project: {
                isArrayEmpty: 0,
                OP: 0
            }
        }]).toArray();

    return JSON.parse(JSON.stringify(data));
}

export const getPost = async (board: string, pn: number) => {
    const postNum: number = parseInt(pn as any);
    const data = await (await db()).collection('posts').findOne({ board, postNum });
    return JSON.parse(JSON.stringify(data));
}

export const postAsOP = async () => {

}

export const postReply = async () => {
    
}