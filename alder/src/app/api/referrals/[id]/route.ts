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

  const referral = await prisma.referral.findUnique({
    where: { id: params.id },
    include: {
      lead: true,
      community: true,
    },
  })

  if (!referral) {
    return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
  }

  return NextResponse.json(referral)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    const referral = await prisma.referral.update({
      where: { id: params.id },
      data: {
        status: body.status,
        tourDate: body.tourDate ? new Date(body.tourDate) : null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        moveInDate: body.moveInDate ? new Date(body.moveInDate) : null,
        referralFeeStatus: body.referralFeeStatus || null,
        referralFeeAmount: body.referralFeeAmount || null,
        notes: body.notes || null,
      },
      include: {
        lead: { select: { id: true, firstName: true, lastName: true } },
        community: true,
      },
    })

    return NextResponse.json(referral)
  } catch (error) {
    console.error('Error updating referral:', error)
    return NextResponse.json({ error: 'Failed to update referral' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.referral.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting referral:', error)
    return NextResponse.json({ error: 'Failed to delete referral' }, { status: 500 })
  }
}
