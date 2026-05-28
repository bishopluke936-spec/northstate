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

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      familyContacts: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }] },
      referrals: {
        include: {
          community: true,
        },
        orderBy: { referralDate: 'desc' },
      },
      communications: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  return NextResponse.json(lead)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      age,
      phone,
      email,
      currentCity,
      preferredLocation,
      budgetMin,
      budgetMax,
      timeline,
      status,
      urgencyLevel,
      notes,
      careLevel,
      mobility,
      medicationSupport,
      memoryDementia,
      fallRisk,
      behavioralConcerns,
      assignedToId,
    } = body

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        age: age || null,
        phone: phone || null,
        email: email || null,
        currentCity: currentCity || null,
        preferredLocation: preferredLocation || null,
        budgetMin: budgetMin || null,
        budgetMax: budgetMax || null,
        timeline: timeline || null,
        status,
        urgencyLevel,
        notes: notes || null,
        careLevel: careLevel || null,
        mobility: mobility || null,
        medicationSupport: medicationSupport || false,
        memoryDementia: memoryDementia || false,
        fallRisk: fallRisk || false,
        behavioralConcerns: behavioralConcerns || false,
        assignedToId: assignedToId || null,
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.lead.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
