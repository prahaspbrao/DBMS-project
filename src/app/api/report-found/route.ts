// app/api/report-found/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { usn, name, description } = await req.json();

    if (!usn || !name || !description) {
      return NextResponse.json({ error: 'USN, name, and description are required' }, { status: 400 });
    }

    // Find the user by USN
    const user = await prisma.user.findUnique({
      where: { usn },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the found item linked to userId
    await prisma.item.create({
      data: {
        name,
        description,
        type: 'FOUND',
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Found item reported successfully' });
  } catch (error) {
    console.error('Error reporting found item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
