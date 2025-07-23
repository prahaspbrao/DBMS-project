// src/app/api/items/all/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { reportedAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
