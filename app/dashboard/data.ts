import { getMongoDb as db } from '@/app/lib/mongodb';
import { FindOptions } from 'mongodb';
import { NextResponse } from 'next/server';
import { isErrorWithStatusCodeType } from '../lib/utils';

export const getLatestPosts = async () => {
    // Get twenty latest posts from all boards
    try {
        const projection: FindOptions = { projection: { IP: 0 } };
        
        const data = await (await db())
            .collection('posts')
            .find({}, projection)
            // Sort by date descending
            .sort({ date: -1 })
            .limit(15)
            .toArray();

        return JSON.parse(JSON.stringify(data));
    } catch (e) {
        return NextResponse.json(
            { message: e instanceof Error || isErrorWithStatusCodeType(e) ? e.message : 'Error!' },
            { status: isErrorWithStatusCodeType(e) ? e.status : 500 }
        );
    }
};