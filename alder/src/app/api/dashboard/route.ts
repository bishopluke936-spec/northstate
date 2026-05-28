import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const AVERAGE_REFERRAL_FEE = 2000

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Active leads (not LOST_CLOSED or MOVED_IN)
  const activeLeads = await prisma.lead.count({
    where: {
      status: {
        notIn: ['LOST_CLOSED', 'MOVED_IN'],
      },
    },
  })

  // New leads this month
  const newThisMonth = await prisma.lead.count({
    where: {
      createdAt: { gte: startOfMonth },
    },
  })

  // Total referrals sent
  const referralsSent = await prisma.referral.count()

  // Tours scheduled
  const toursScheduled = await prisma.referral.count({
    where: { status: 'TOUR_SCHEDULED' },
  })

  // Move-ins
  const moveIns = await prisma.referral.count({
    where: { status: 'MOVED_IN' },
  })

  // Estimated revenue (move-ins with fee or default)
  const moveInReferrals = await prisma.referral.findMany({
    where: { status: 'MOVED_IN' },
    select: { referralFeeAmount: true },
  })

  const estimatedRevenue = moveInReferrals.reduce((sum, ref) => {
    return sum + (ref.referralFeeAmount || AVERAGE_REFERRAL_FEE)
  }, 0)

  // Leads needing follow-up (communication with overdue followUpDate)
  const overdueCommunications = await prisma.communication.findMany({
    where: {
      followUpDate: { lte: now },
      followUpReminder: true,
    },
    select: { leadId: true },
    distinct: ['leadId'],
  })

  const followUpLeadIds = overdueCommunications.map((c) => c.leadId)

  const needsFollowUp = await prisma.lead.findMany({
    where: {
      id: { in: followUpLeadIds },
      status: { notIn: ['LOST_CLOSED', 'MOVED_IN'] },
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { urgencyLevel: 'asc' },
    take: 10,
  })

  // Recent communications
  const recentCommunications = await prisma.communication.findMany({
    include: {
      lead: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { date: 'desc' },
    take: 5,
  })

  return NextResponse.json({
    activeLeads,
    newThisMonth,
    referralsSent,
    toursScheduled,
    moveIns,
    estimatedRevenue,
    needsFollowUp,
    recentCommunications,
  })
}
