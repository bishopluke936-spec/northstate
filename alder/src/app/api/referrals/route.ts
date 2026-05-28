import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || ''
  const feeStatus = searchParams.get('feeStatus') || ''

  const where: Record<string, unknown> = {}

  if (status) where.status = status
  if (feeStatus) where.referralFeeStatus = feeStatus

  const referrals = await prisma.referral.findMany({
    where,
    include: {
      lead: {
        select: { id: true, firstName: true, lastName: true, status: true },
      },
      community: {
        select: { id: true, name: true, city: true, state: true },
      },
    },
    orderBy: { referralDate: 'desc' },
  })

  return NextResponse.json(referrals)
}
