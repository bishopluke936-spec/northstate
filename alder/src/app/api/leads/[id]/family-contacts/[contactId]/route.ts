import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, relationship, phone, email, preferredContact, isPrimary } = body

    const contact = await prisma.familyContact.update({
      where: { id: params.contactId },
      data: {
        name,
        relationship,
        phone: phone || null,
        email: email || null,
        preferredContact: preferredContact || null,
        isPrimary: isPrimary || false,
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating family contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contactId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.familyContact.delete({ where: { id: params.contactId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting family contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
