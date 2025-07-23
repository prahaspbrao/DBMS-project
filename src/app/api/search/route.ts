import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { query } = body

    const searchQuery = `%${query?.trim().toLowerCase() || ''}%`

    const lostItems = await prisma.$queryRaw<
      Array<{
        id: number
        description: string
        location: string | null
        reportedAt: Date
        isReturned: boolean
        type: string
        userId: number
        usn: string
        email: string
      }>
    >`
      SELECT i.*, u.usn, u.email
      FROM Item i
      JOIN User u ON i.userId = u.id
      WHERE LOWER(i.description) LIKE ${searchQuery}
        AND i.isReturned = false
        AND i.type = 'LOST'
      ORDER BY i.reportedAt DESC
    `

    const foundItems = await prisma.$queryRaw<
      Array<{
        id: number
        description: string
        location: string | null
        reportedAt: Date
        isReturned: boolean
        type: string
        userId: number
        usn: string
        email: string
      }>
    >`
      SELECT i.*, u.usn, u.email
      FROM Item i
      JOIN User u ON i.userId = u.id
      WHERE LOWER(i.description) LIKE ${searchQuery}
        AND i.isReturned = false
        AND i.type = 'FOUND'
      ORDER BY i.reportedAt DESC
    `

    return NextResponse.json({ lostItems, foundItems })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ lostItems: [], foundItems: [], error: 'Internal Server Error' }, { status: 500 })
  }
}
