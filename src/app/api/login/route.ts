import { NextResponse } from 'next/server'
import prisma from '../../../../lib/db'

function convertDobToISO(dob: string) {
  const parts = dob.split('-')
  if (parts.length !== 3) return dob
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

export async function POST(request: Request) {
  try {
    const { usn, dob } = await request.json()

    if (!usn || !dob) {
      return NextResponse.json({ message: 'Missing USN or DOB' }, { status: 400 })
    }

    const dobIso = convertDobToISO(dob)

    const user = await prisma.user.findFirst({
      where: {
        usn: usn.toUpperCase(),
        dob: dobIso,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid USN or Date of Birth' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)  // Logs error to server console
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
