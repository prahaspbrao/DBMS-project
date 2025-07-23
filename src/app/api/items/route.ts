import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: { name, description },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
