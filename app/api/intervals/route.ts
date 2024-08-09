import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // console.log('API route hit:', request.url);

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    if (!level) {
        return NextResponse.json({ error: 'Level is required' }, { status: 400 });
    }

    try {
        const intervals = await prisma.level.findUnique({
            where: { level: parseInt(level) },
            include: { Intervals: true },
        });
        // console.log(intervals);
        if (!intervals) {
            return NextResponse.json({ error: 'Level not found' }, { status: 404 });
        }

        return NextResponse.json(intervals.Intervals);
    } catch (error) {
        console.error('Error fetching intervals:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}