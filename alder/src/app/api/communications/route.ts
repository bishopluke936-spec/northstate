import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || ''
  const search = searchParams.get('search') || ''

  const where: Record<string, unknown> = {}

  if (type) where.type = type

  if (search) {
    where.OR = [
      { summary: { contains: search } },
      {
        lead: {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        },
      },
    ]
  }

  const communications = await prisma.communication.findMany({
    where,
    include: {
      lead: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { date: 'desc' },
    take: 100,
  })

  return NextResponse.json(communications)
}
