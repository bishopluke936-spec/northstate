import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contacts = await prisma.familyContact.findMany({
    where: { leadId: params.id },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json(contacts)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, relationship, phone, email, preferredContact, isPrimary } = body

    if (!name || !relationship) {
      return NextResponse.json({ error: 'Name and relationship are required' }, { status: 400 })
    }

    const contact = await prisma.familyContact.create({
      data: {
        leadId: params.id,
        name,
        relationship,
        phone: phone || null,
        email: email || null,
        preferredContact: preferredContact || null,
        isPrimary: isPrimary || false,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating family contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
