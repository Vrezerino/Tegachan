import { getMongoDb as db } from '@/app/lib/mongodb';
import { FindOptions } from 'mongodb';

export const getLatestPosts = async () => {
    const projection: FindOptions = { projection: { IP: 0 } };
    
    // Get twenty latest posts from all boards
    const data = await (await db())
        .collection('posts')
        .find({}, projection)
        // Sort by date descending
        .sort({ date: -1 })
        .limit(20)
        .toArray();

    return JSON.parse(JSON.stringify(data));
};