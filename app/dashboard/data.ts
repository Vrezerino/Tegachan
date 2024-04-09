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