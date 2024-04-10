import { getMongoDb as db } from '@/app/lib/mongodb';

export const getBumpedPosts = async (board: string) => {

    /**
     * Get thread starter (OP) posts from a certain board and sort either by
     * date or the date of the last reply to the post
     */
    const data = await (await db()).collection('posts').aggregate([
        {
            $match: {
                OP: true, // Only consider OP posts
                board // Match the specified board parameter
            }
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'replyTo',
                foreignField: 'postNum',
                as: 'parentPosts'
            }
        },
        {
            $addFields: {
                sortBy: {
                    $cond: {
                        if: { $eq: ['$OP', true] }, // Check if the post is OP
                        then: '$date', // If OP, sort by the post date
                        else: { $max: '$parentPosts.date' } // Otherwise, sort by the max date in parentPosts
                    }
                }
            }
        },
        {
            $sort: {
                'sortBy': -1 // Sort by the calculated sort date
            }
        },
        {
            $project: {
                IP: 0
            }
        }
    ]).toArray();

    return JSON.parse(JSON.stringify(data));
};