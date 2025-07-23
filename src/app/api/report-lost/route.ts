// app/api/report-lost/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db'; // or import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { usn, name, description } = await req.json();

    if (!usn || !name || !description) {
      return NextResponse.json(
        { error: 'USN, name, and description are required' },
        { status: 400 }
      );
    }

    const normalizedUsn = usn.toUpperCase();

    const user = await prisma.user.findUnique({
      where: { usn: normalizedUsn },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.item.create({
      data: {
        name,
        description,
        type: 'LOST',
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Lost item reported successfully' });
  } catch (error) {
    console.error('Error reporting lost item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
