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

  const community = await prisma.community.findUnique({
    where: { id: params.id },
    include: {
      referrals: {
        include: {
          lead: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { referralDate: 'desc' },
      },
    },
  })

  if (!community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 })
  }

  return NextResponse.json(community)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    const community = await prisma.community.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zip: body.zip || null,
        contactPerson: body.contactPerson || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        careLevels: body.careLevels || null,
        pricingMin: body.pricingMin || null,
        pricingMax: body.pricingMax || null,
        availability: body.availability || null,
        referralAgreement: body.referralAgreement || false,
        referralFeeType: body.referralFeeType || null,
        referralFeeAmount: body.referralFeeAmount || null,
        notes: body.notes || null,
      },
    })

    return NextResponse.json(community)
  } catch (error) {
    console.error('Error updating community:', error)
    return NextResponse.json({ error: 'Failed to update community' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.community.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting community:', error)
    return NextResponse.json({ error: 'Failed to delete community' }, { status: 500 })
  }
}
