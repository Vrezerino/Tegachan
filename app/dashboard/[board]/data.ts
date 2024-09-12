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
                localField: 'replies', // Array of postNums
                foreignField: 'postNum', // Find posts by postNum
                as: 'repliedPosts' // Output the matched posts in repliedPosts array
            }
        },
        // Add a field "lastReplyDate" that is the date of the last reply, or null if no replies
        {
            $addFields: {
                lastReplyDate: {
                    $cond: {
                        if: { $gt: [{ $size: '$repliedPosts' }, 0] }, // Check if there are any replies
                        then: { $max: '$repliedPosts.date' }, // Get the maximum date from replies
                        else: '$date' // If no replies, use the post's own date
                    }
                }
            }
        },
        // Sort by lastReplyDate in descending order
        {
            $sort: { lastReplyDate: -1 }
        },
        {
            $project: {
                IP: 0
            }
        }
    ]).toArray();

    return JSON.parse(JSON.stringify(data));
};