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

  const communications = await prisma.communication.findMany({
    where: { leadId: params.id },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(communications)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      type,
      date,
      summary,
      nextStep,
      followUpDate,
      followUpReminder,
    } = body

    if (!summary) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 })
    }

    const communication = await prisma.communication.create({
      data: {
        leadId: params.id,
        type: type || 'CALL',
        date: date ? new Date(date) : new Date(),
        summary,
        nextStep: nextStep || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        followUpReminder: followUpReminder || false,
      },
    })

    return NextResponse.json(communication, { status: 201 })
  } catch (error) {
    console.error('Error creating communication:', error)
    return NextResponse.json({ error: 'Failed to log communication' }, { status: 500 })
  }
}
