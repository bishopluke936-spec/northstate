import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const careLevel = searchParams.get('careLevel') || ''

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { city: { contains: search } },
      { contactPerson: { contains: search } },
    ]
  }

  if (careLevel) {
    where.careLevels = { contains: careLevel }
  }

  const communities = await prisma.community.findMany({
    where,
    include: {
      _count: { select: { referrals: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(communities)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      name,
      address,
      city,
      state,
      zip,
      contactPerson,
      phone,
      email,
      website,
      careLevels,
      pricingMin,
      pricingMax,
      availability,
      referralAgreement,
      referralFeeType,
      referralFeeAmount,
      notes,
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const community = await prisma.community.create({
      data: {
        name,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        contactPerson: contactPerson || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        careLevels: careLevels || null,
        pricingMin: pricingMin || null,
        pricingMax: pricingMax || null,
        availability: availability || null,
        referralAgreement: referralAgreement || false,
        referralFeeType: referralFeeType || null,
        referralFeeAmount: referralFeeAmount || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    console.error('Error creating community:', error)
    return NextResponse.json({ error: 'Failed to create community' }, { status: 500 })
  }
}
