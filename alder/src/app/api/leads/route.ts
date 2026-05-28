import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const careLevel = searchParams.get('careLevel') || ''
  const urgency = searchParams.get('urgency') || ''

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
      { currentCity: { contains: search } },
    ]
  }

  if (status) where.status = status
  if (urgency) where.urgencyLevel = urgency
  if (careLevel) where.careLevel = { contains: careLevel }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      familyContacts: {
        where: { isPrimary: true },
        take: 1,
      },
      communications: {
        orderBy: { date: 'desc' },
        take: 1,
      },
      _count: {
        select: { referrals: true, communications: true },
      },
    },
    orderBy: [
      { urgencyLevel: 'desc' },
      { updatedAt: 'desc' },
    ],
  })

  return NextResponse.json(leads)
}

export async function POST(request: NextRequest) {
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
      familyContacts,
    } = body

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First and last name are required' }, { status: 400 })
    }

    const lead = await prisma.lead.create({
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
        status: status || 'NEW_LEAD',
        urgencyLevel: urgencyLevel || 'MEDIUM',
        notes: notes || null,
        careLevel: careLevel || null,
        mobility: mobility || null,
        medicationSupport: medicationSupport || false,
        memoryDementia: memoryDementia || false,
        fallRisk: fallRisk || false,
        behavioralConcerns: behavioralConcerns || false,
        assignedToId: assignedToId || null,
        familyContacts: familyContacts && familyContacts.length > 0
          ? {
              create: familyContacts.map((fc: Record<string, unknown>) => ({
                name: fc.name,
                relationship: fc.relationship,
                phone: fc.phone || null,
                email: fc.email || null,
                preferredContact: fc.preferredContact || null,
                isPrimary: fc.isPrimary || false,
              })),
            }
          : undefined,
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        familyContacts: true,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
