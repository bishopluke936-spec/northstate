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

  const referrals = await prisma.referral.findMany({
    where: { leadId: params.id },
    include: {
      community: true,
    },
    orderBy: { referralDate: 'desc' },
  })

  return NextResponse.json(referrals)
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
      communityId,
      referralDate,
      status,
      tourDate,
      followUpDate,
      referralFeeStatus,
      referralFeeAmount,
      notes,
    } = body

    if (!communityId) {
      return NextResponse.json({ error: 'Community is required' }, { status: 400 })
    }

    const referral = await prisma.referral.create({
      data: {
        leadId: params.id,
        communityId,
        referralDate: referralDate ? new Date(referralDate) : new Date(),
        status: status || 'SENT',
        tourDate: tourDate ? new Date(tourDate) : null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        referralFeeStatus: referralFeeStatus || 'PENDING',
        referralFeeAmount: referralFeeAmount || null,
        notes: notes || null,
      },
      include: {
        community: true,
      },
    })

    return NextResponse.json(referral, { status: 201 })
  } catch (error) {
    console.error('Error creating referral:', error)
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 })
  }
}
