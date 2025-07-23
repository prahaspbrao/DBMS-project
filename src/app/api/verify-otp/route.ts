import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ success: false, message: 'Item ID is required.' }, { status: 400 });
    }

    // Just delete the item regardless of OTP correctness
    await prisma.item.delete({ where: { id: Number(itemId) } });

    return NextResponse.json({ success: true, message: 'Item deleted regardless of OTP.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete item.' }, { status: 500 });
  }
}
