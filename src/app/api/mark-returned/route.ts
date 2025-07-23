import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { itemId } = body

    if (!itemId) {
      return NextResponse.json({ message: 'Missing itemId in request body' }, { status: 400 })
    }

    await prisma.item.update({
      where: { id: itemId },
      data: { isReturned: true },
    })

    return NextResponse.json({ message: 'Item marked as returned successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in mark-returned route:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
