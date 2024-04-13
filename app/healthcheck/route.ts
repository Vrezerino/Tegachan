import { NextResponse } from 'next/server';

export const GET = (): NextResponse => {
    return new NextResponse('OK', { status: 200 });
}